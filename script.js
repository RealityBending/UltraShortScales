// -- Helpers -----------------------------------------------------------------

function escHtml(str) {
    if (str == null) return ""
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;")
}

function countDomainMeasures(domain) {
    return domain.categories.reduce((s, c) => s + c.groups.reduce((s2, g) => s2 + g.measures.length, 0), 0)
}

function countCatMeasures(cat) {
    return cat.groups.reduce((s, g) => s + g.measures.length, 0)
}

function formatDims(dims) {
    if (!dims || dims.length === 0) return '<span class="cell-empty">-</span>'
    const names = dims.map((d) => d.name)
    const shown = names.slice(0, 2)
    const extra = names.length - shown.length
    let html = shown.map((n) => `<span class="dim-pill">${escHtml(n)}</span>`).join("")
    if (extra > 0) html += ` <span class="dim-more">+${extra} more</span>`
    return html
}

function formatRefs(refs) {
    if (!refs || refs.length === 0) return '<span class="cell-empty">-</span>'
    const fullTitle = escHtml(refs.join("; "))
    const shown = escHtml(refs[0])
    const extra = refs.length > 1 ? ` <span class="ref-more" title="${fullTitle}">+${refs.length - 1}</span>` : ""
    return `<span title="${fullTitle}">${shown}</span>${extra}`
}

function summarizeText(text, max = 220) {
    if (!text) return ""
    const compact = text.replace(/\s+/g, " ").trim()
    if (compact.length <= max) return compact
    return `${compact.slice(0, max - 1).trimEnd()}...`
}

function pluralize(count, noun) {
    return `${count} ${noun}${count === 1 ? "" : "s"}`
}

// -- Hierarchy model ----------------------------------------------------------

const DOMAIN_HUES = [175, 295, 55]
const hierarchy = {
    rootId: "root",
    nodes: new Map(),
}

let networkCenterId = null
let networkRenderFrame = 0
let networkResizeObserver = null

function addHierarchyNode(node) {
    hierarchy.nodes.set(node.id, {
        childIds: [],
        tableExpandable: false,
        ...node,
    })

    if (node.parentId) {
        const parent = hierarchy.nodes.get(node.parentId)
        if (parent) parent.childIds.push(node.id)
    }
}

function getNode(id) {
    return hierarchy.nodes.get(id) || null
}

function getNodeChildren(node, types) {
    if (!node) return []
    const children = node.childIds.map((id) => getNode(id)).filter(Boolean)
    return types ? children.filter((child) => types.includes(child.type)) : children
}

function getTableAncestorId(node) {
    let current = node
    while (current && !["domain", "category", "group", "measure"].includes(current.type)) {
        current = getNode(current.parentId)
    }
    return current ? current.id : null
}

function getMeasureAncestor(node) {
    let current = node
    while (current && current.type !== "measure") {
        current = getNode(current.parentId)
    }
    return current
}

function buildHierarchyModel() {
    hierarchy.nodes.clear()

    addHierarchyNode({
        id: hierarchy.rootId,
        type: "root",
        label: "Domains",
    })

    questionnaireCompendium.forEach((domain, di) => {
        const domainId = `d${di}`
        const domH = DOMAIN_HUES[di % DOMAIN_HUES.length]

        addHierarchyNode({
            id: domainId,
            type: "domain",
            label: domain.domain,
            parentId: hierarchy.rootId,
            domainIndex: di,
            hue: domH,
            measureCount: countDomainMeasures(domain),
            data: domain,
            tableExpandable: true,
        })

        domain.categories.forEach((cat, ci) => {
            const catId = `d${di}c${ci}`
            const numCats = domain.categories.length
            const catH = domH + (ci - (numCats - 1) / 2) * (30 / Math.max(numCats - 1, 1))

            addHierarchyNode({
                id: catId,
                type: "category",
                label: cat.category,
                parentId: domainId,
                domainIndex: di,
                hue: catH,
                measureCount: countCatMeasures(cat),
                data: cat,
                tableExpandable: true,
            })

            cat.groups.forEach((group, gi) => {
                const groupId = `d${di}c${ci}g${gi}`

                addHierarchyNode({
                    id: groupId,
                    type: "group",
                    label: group.group,
                    parentId: catId,
                    domainIndex: di,
                    hue: catH,
                    measureCount: group.measures.length,
                    data: group,
                    tableExpandable: true,
                })

                const sortedMeasures = [...group.measures].sort((a, b) => (a.total_items || 0) - (b.total_items || 0))
                sortedMeasures.forEach((measure, mi) => {
                    const measureId = `d${di}c${ci}g${gi}m${mi}`
                    const dimensionsWithItems = (measure.dimensions || []).filter((dim) => dim.items && dim.items.length > 0)
                    const hasNotes = Boolean(measure.notes && measure.notes.trim())
                    const hasInstructions = Boolean(measure.instructions && measure.instructions.trim())
                    const hasDetail = dimensionsWithItems.length > 0 || hasNotes || hasInstructions

                    addHierarchyNode({
                        id: measureId,
                        type: "measure",
                        label: measure.name,
                        shortName: measure.short_name || "",
                        parentId: groupId,
                        domainIndex: di,
                        hue: domH,
                        totalItems: measure.total_items || 0,
                        references: measure.references || [],
                        scale: measure.scale || "",
                        notes: measure.notes || "",
                        instructions: measure.instructions || "",
                        measureCount: measure.total_items || 0,
                        data: measure,
                        tableExpandable: hasDetail,
                    })

                    dimensionsWithItems.forEach((dim, dimIndex) => {
                        const dimId = `${measureId}d${dimIndex}`

                        addHierarchyNode({
                            id: dimId,
                            type: "dimension",
                            label: dim.name,
                            parentId: measureId,
                            domainIndex: di,
                            hue: domH,
                            itemCount: dim.items.length,
                            data: dim,
                        })

                        dim.items.forEach((item, itemIndex) => {
                            addHierarchyNode({
                                id: `${dimId}i${itemIndex}`,
                                type: "item",
                                label: item,
                                parentId: dimId,
                                domainIndex: di,
                                hue: domH,
                            })
                        })
                    })
                })
            })
        })
    })
}

// -- Table builder ------------------------------------------------------------

function buildTable() {
    const tbody = document.querySelector("#compendium-table tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    getNodeChildren(getNode(hierarchy.rootId), ["domain"]).forEach((domain) => {
        const dRow = document.createElement("tr")
        dRow.className = `row-domain dom-${domain.domainIndex} expanded`
        dRow.dataset.id = domain.id
        dRow.dataset.level = "0"
        dRow.innerHTML = `<td colspan="5">
            <span class="toggle-icon">▼</span>
            <span class="row-label">${escHtml(domain.label)}</span>
            <span class="count-badge">${pluralize(domain.measureCount, "scale")}</span>
        </td>`
        dRow.addEventListener("click", () => {
            networkCenterId = domain.id
            toggleTreeNode(domain.id)
        })
        tbody.appendChild(dRow)

        const categoryNodes = getNodeChildren(domain, ["category"])
        categoryNodes.forEach((category) => {
            const cRow = document.createElement("tr")
            cRow.className = `row-category dom-${domain.domainIndex}`
            cRow.dataset.id = category.id
            cRow.dataset.parent = domain.id
            cRow.dataset.level = "1"
            cRow.style.cssText = `--cat-bg:hsl(${category.hue},60%,35%);--cat-hov:hsl(${category.hue},60%,42%);`
            cRow.innerHTML = `<td colspan="5">
                <span class="toggle-icon">▶</span>
                <span class="row-label">${escHtml(category.label)}</span>
                <span class="count-badge">${pluralize(category.measureCount, "scale")}</span>
            </td>`
            cRow.addEventListener("click", () => {
                networkCenterId = category.id
                toggleTreeNode(category.id)
            })
            tbody.appendChild(cRow)

            const groupNodes = getNodeChildren(category, ["group"])
            groupNodes.forEach((group, gi) => {
                const gBgL = groupNodes.length > 1 ? Math.round(88 - gi * (12 / (groupNodes.length - 1))) : 84

                const gRow = document.createElement("tr")
                gRow.className = `row-group dom-${domain.domainIndex}`
                gRow.dataset.id = group.id
                gRow.dataset.parent = category.id
                gRow.dataset.level = "2"
                gRow.style.cssText =
                    [
                        `--g-bg:hsl(${category.hue},45%,${gBgL}%)`,
                        `--g-txt:hsl(${category.hue},70%,22%)`,
                        `--g-bdr:hsl(${category.hue},40%,${gBgL - 8}%)`,
                        `--g-hov:hsl(${category.hue},45%,${gBgL - 6}%)`,
                        "display:none",
                    ].join(";") + ";"
                gRow.innerHTML = `<td colspan="5">
                    <span class="toggle-icon">▶</span>
                    <span class="row-label">${escHtml(group.label)}</span>
                    <span class="count-badge">${pluralize(group.measureCount, "scale")}</span>
                </td>`
                gRow.addEventListener("click", () => {
                    networkCenterId = group.id
                    toggleTreeNode(group.id)
                })
                tbody.appendChild(gRow)

                getNodeChildren(group, ["measure"]).forEach((measure) => {
                    const mRow = document.createElement("tr")
                    mRow.className = `row-measure dom-${domain.domainIndex}` + (measure.tableExpandable ? " has-detail" : "")
                    mRow.dataset.id = measure.id
                    mRow.dataset.parent = group.id
                    mRow.dataset.level = "3"
                    mRow.style.display = "none"
                    mRow.style.setProperty("--measure-bg", `hsl(${domain.hue}, 20%, 97%)`)

                    const shortTag = measure.shortName ? `<span class="short-name">${escHtml(measure.shortName)}</span>` : ""
                    const toggleEl = measure.tableExpandable
                        ? '<span class="toggle-icon">▶</span>'
                        : '<span class="toggle-placeholder"></span>'

                    mRow.innerHTML = `
                        <td class="col-name">
                            <div class="name-cell">
                                ${toggleEl}
                                <span class="measure-name">${escHtml(measure.label)}</span>
                                ${shortTag}
                            </div>
                        </td>
                        <td class="col-n">${measure.totalItems || "-"}</td>
                        <td class="col-scale">${escHtml(measure.scale || "-")}</td>
                        <td class="col-dims">${formatDims(measure.data.dimensions)}</td>
                        <td class="col-refs">${formatRefs(measure.references)}</td>
                    `

                    if (measure.tableExpandable) {
                        mRow.addEventListener("click", () => {
                            networkCenterId = measure.id
                            toggleTreeNode(measure.id)
                        })
                    }
                    tbody.appendChild(mRow)

                    if (measure.tableExpandable) {
                        const detailRow = document.createElement("tr")
                        detailRow.className = `row-detail dom-${domain.domainIndex}`
                        detailRow.dataset.parent = measure.id
                        detailRow.style.display = "none"

                        const detailParts = []
                        if (measure.notes) {
                            detailParts.push(`<div class="detail-notes">${escHtml(measure.notes)}</div>`)
                        }
                        if (measure.instructions) {
                            detailParts.push(
                                `<div class="detail-instructions"><span class="detail-instructions-label">Instructions:</span> ${escHtml(measure.instructions)}</div>`,
                            )
                        }
                        getNodeChildren(measure, ["dimension"]).forEach((dimension) => {
                            const itemHtml = getNodeChildren(dimension, ["item"])
                                .map((item) => `<li>${escHtml(item.label)}</li>`)
                                .join("")
                            detailParts.push(`
                                <div class="detail-dim-block">
                                    <div class="detail-dim-name">${escHtml(dimension.label)}</div>
                                    <ul class="detail-items">${itemHtml}</ul>
                                </div>`)
                        })

                        detailRow.innerHTML = `<td colspan="5"><div class="detail-content">${detailParts.join("")}</div></td>`
                        tbody.appendChild(detailRow)
                    }
                })
            })
        })
    })
}

// -- Table state --------------------------------------------------------------

function getRowEl(rowId) {
    return document.querySelector(`[data-id="${rowId}"]`)
}

function isRowVisible(rowId) {
    const row = getRowEl(rowId)
    return Boolean(row) && row.style.display !== "none"
}

function isTreeExpanded(rowId) {
    const row = getRowEl(rowId)
    return Boolean(row) && row.classList.contains("expanded")
}

function setExpandedAppearance(row, expanded) {
    row.classList.toggle("expanded", expanded)
    const icon = row.querySelector(".toggle-icon")
    if (icon) icon.textContent = expanded ? "▼" : "▶"
}

function collapseDescendants(rowId) {
    document.querySelectorAll(`[data-parent="${rowId}"]`).forEach((child) => {
        child.style.display = "none"
        if (child.classList.contains("expanded")) {
            child.classList.remove("expanded")
            const icon = child.querySelector(".toggle-icon")
            if (icon) icon.textContent = "▶"
        }

        if (child.dataset.id) {
            collapseDescendants(child.dataset.id)
        }
    })
}

function setTreeExpanded(rowId, expanded) {
    const row = getRowEl(rowId)
    if (!row) return

    setExpandedAppearance(row, expanded)

    if (expanded) {
        document.querySelectorAll(`[data-parent="${rowId}"]`).forEach((child) => {
            child.style.display = ""
        })
        return
    }

    collapseDescendants(rowId)
}

function toggleTreeNode(rowId) {
    const node = getNode(rowId)
    if (!node || !node.tableExpandable) {
        renderNetwork()
        return
    }

    setTreeExpanded(rowId, !isTreeExpanded(rowId))
    renderNetwork()
}

function resetTable() {
    document.querySelectorAll(".row-detail").forEach((row) => {
        row.style.display = "none"
    })

    document.querySelectorAll("tr[data-level]").forEach((row) => {
        const level = parseInt(row.dataset.level, 10)
        if (level === 0) {
            row.style.display = ""
            setExpandedAppearance(row, true)
        } else if (level === 1) {
            row.style.display = ""
            setExpandedAppearance(row, false)
        } else {
            row.style.display = "none"
            setExpandedAppearance(row, false)
        }
    })
}

// -- Search -------------------------------------------------------------------

function setupSearch() {
    const input = document.getElementById("search-input")
    if (!input) return

    input.addEventListener("input", () => {
        const q = input.value.toLowerCase().trim()
        if (q === "") {
            resetTable()
        } else {
            filterTable(q)
        }
        renderNetwork()
    })
}

function filterTable(q) {
    document.querySelectorAll("tr[data-level], .row-detail").forEach((row) => {
        row.style.display = "none"
    })

    const visibleAncestors = new Set()
    const visibleMeasures = new Set()

    document.querySelectorAll(".row-measure").forEach((row) => {
        const name = (row.querySelector(".measure-name")?.textContent || "").toLowerCase()
        const abbr = (row.querySelector(".short-name")?.textContent || "").toLowerCase()
        if (name.includes(q) || abbr.includes(q)) {
            row.style.display = ""
            visibleMeasures.add(row.dataset.id)

            let parentId = row.dataset.parent
            while (parentId) {
                visibleAncestors.add(parentId)
                const parentRow = getRowEl(parentId)
                parentId = parentRow ? parentRow.dataset.parent : null
            }
        }
    })

    document.querySelectorAll(".row-domain, .row-category, .row-group").forEach((row) => {
        const shouldShow = visibleAncestors.has(row.dataset.id)
        row.style.display = shouldShow ? "" : "none"
        setExpandedAppearance(row, shouldShow)
    })

    document.querySelectorAll(".row-measure.has-detail").forEach((row) => {
        const detailRow = document.querySelector(`.row-detail[data-parent="${row.dataset.id}"]`)
        if (visibleMeasures.has(row.dataset.id) && row.classList.contains("expanded") && detailRow) {
            detailRow.style.display = ""
        } else if (detailRow) {
            detailRow.style.display = "none"
        }
    })
}

// -- Right panel --------------------------------------------------------------

function initNetworkPanel() {
    const panel = document.getElementById("panel-right")
    if (!panel) return

    panel.innerHTML = `
        <div class="network-panel">
            <div class="network-header">
                <div>
                    <p class="network-kicker">Node View</p>
                    <h2 class="network-title" id="network-title">Domains</h2>
                </div>
                <button type="button" class="network-reset" id="network-reset">Reset focus</button>
            </div>
            <div class="network-breadcrumbs" id="network-breadcrumbs"></div>
            <div class="network-stage" id="network-stage">
                <svg id="network-links" aria-hidden="true"></svg>
                <div id="network-nodes"></div>
            </div>
            <div class="network-inspector" id="network-inspector"></div>
        </div>
    `

    document.getElementById("network-reset")?.addEventListener("click", () => {
        networkCenterId = null
        renderNetwork()
    })

    const stage = document.getElementById("network-stage")
    if (stage && typeof ResizeObserver !== "undefined") {
        networkResizeObserver?.disconnect()
        networkResizeObserver = new ResizeObserver(() => {
            scheduleRenderNetwork(1)
        })
        networkResizeObserver.observe(stage)
    }

    window.addEventListener("resize", () => scheduleRenderNetwork(1))
    window.addEventListener("load", () => scheduleRenderNetwork(2), { once: true })
}

function normalizeNetworkCenter() {
    let current = networkCenterId ? getNode(networkCenterId) : null

    while (current) {
        if (current.type === "root") {
            networkCenterId = null
            return
        }

        if (["dimension", "item"].includes(current.type)) {
            const measure = getMeasureAncestor(current)
            if (measure && isTreeExpanded(measure.id) && isRowVisible(measure.id)) break
            current = getNode(current.parentId)
            continue
        }

        if (!isRowVisible(current.id)) {
            current = getNode(current.parentId)
            continue
        }

        break
    }

    networkCenterId = current ? current.id : null
}

function getVisibleNetworkChildren(node) {
    if (!node) {
        return getNodeChildren(getNode(hierarchy.rootId), ["domain"]).filter((child) => isRowVisible(child.id))
    }

    if (node.type === "measure") {
        if (!isTreeExpanded(node.id)) return []
        return getNodeChildren(node, ["dimension"])
    }

    if (node.type === "dimension") {
        return getNodeChildren(node, ["item"])
    }

    if (node.type === "item") return []

    return getNodeChildren(node, ["category", "group", "measure"]).filter((child) => isRowVisible(child.id))
}

function getPreviewNetworkChildren(node) {
    if (!node) return []

    if (node.type === "measure") {
        return getNodeChildren(node, ["dimension"])
    }

    if (node.type === "dimension") {
        return getNodeChildren(node, ["item"])
    }

    if (node.type === "item") return []

    return getNodeChildren(node, ["category", "group", "measure"])
}

function getNodeHue(node) {
    return node?.hue ?? 210
}

function getNodeTheme(node) {
    if (!node) {
        return {
            bgStart: "rgba(255, 255, 255, 0.94)",
            bgEnd: "rgba(226, 232, 240, 0.88)",
            border: "rgba(148, 163, 184, 0.34)",
            text: "#102033",
            meta: "rgba(15, 23, 42, 0.66)",
            glow: "rgba(15, 23, 42, 0.12)",
            ring: "rgba(15, 23, 42, 0.14)",
            line: "rgba(100, 116, 139, 0.22)",
        }
    }

    if (node.type === "domain") {
        const saturation = node.domainIndex === 1 ? 55 : 70
        const lightness = node.domainIndex === 0 ? 20 : 22
        const lightnessAlt = node.domainIndex === 0 ? 26 : 28
        return {
            bgStart: `hsl(${node.hue}, ${saturation}%, ${lightness}%)`,
            bgEnd: `hsl(${node.hue}, ${saturation}%, ${lightnessAlt}%)`,
            border: `hsl(${node.hue}, ${saturation}%, ${lightnessAlt + 6}%)`,
            text: "rgba(255, 255, 255, 0.96)",
            meta: "rgba(255, 255, 255, 0.78)",
            glow: `hsla(${node.hue}, ${saturation}%, ${lightnessAlt}%, 0.28)`,
            ring: `hsla(${node.hue}, ${saturation}%, ${lightnessAlt + 10}%, 0.26)`,
            line: `hsla(${node.hue}, ${saturation}%, ${lightnessAlt + 12}%, 0.28)`,
        }
    }

    if (node.type === "category") {
        return {
            bgStart: `hsl(${node.hue}, 60%, 35%)`,
            bgEnd: `hsl(${node.hue}, 60%, 42%)`,
            border: `hsl(${node.hue}, 60%, 50%)`,
            text: "rgba(255, 255, 255, 0.95)",
            meta: "rgba(255, 255, 255, 0.78)",
            glow: `hsla(${node.hue}, 60%, 42%, 0.26)`,
            ring: `hsla(${node.hue}, 70%, 62%, 0.24)`,
            line: `hsla(${node.hue}, 60%, 40%, 0.26)`,
        }
    }

    if (node.type === "group") {
        return {
            bgStart: `hsl(${node.hue}, 45%, 88%)`,
            bgEnd: `hsl(${node.hue}, 45%, 80%)`,
            border: `hsl(${node.hue}, 40%, 72%)`,
            text: `hsl(${node.hue}, 70%, 22%)`,
            meta: `hsla(${node.hue}, 50%, 22%, 0.72)`,
            glow: `hsla(${node.hue}, 35%, 42%, 0.16)`,
            ring: `hsla(${node.hue}, 60%, 58%, 0.18)`,
            line: `hsla(${node.hue}, 40%, 48%, 0.24)`,
        }
    }

    if (node.type === "measure") {
        return {
            bgStart: `hsl(${node.hue}, 20%, 98%)`,
            bgEnd: `hsl(${node.hue}, 20%, 94%)`,
            border: `hsl(${node.hue}, 24%, 84%)`,
            text: "#102033",
            meta: `hsla(${node.hue}, 30%, 22%, 0.68)`,
            glow: `hsla(${node.hue}, 32%, 38%, 0.12)`,
            ring: `hsla(${node.hue}, 60%, 56%, 0.16)`,
            line: `hsla(${node.hue}, 38%, 42%, 0.18)`,
        }
    }

    if (node.type === "dimension") {
        return {
            bgStart: `hsl(${node.hue}, 60%, 97%)`,
            bgEnd: `hsl(${node.hue}, 55%, 92%)`,
            border: `hsl(${node.hue}, 45%, 82%)`,
            text: "#102033",
            meta: `hsla(${node.hue}, 30%, 24%, 0.64)`,
            glow: `hsla(${node.hue}, 34%, 42%, 0.12)`,
            ring: `hsla(${node.hue}, 60%, 56%, 0.14)`,
            line: `hsla(${node.hue}, 38%, 42%, 0.16)`,
        }
    }

    return {
        bgStart: `hsl(${node.hue}, 48%, 99%)`,
        bgEnd: `hsl(${node.hue}, 36%, 95%)`,
        border: `hsl(${node.hue}, 28%, 84%)`,
        text: "#102033",
        meta: `hsla(${node.hue}, 26%, 24%, 0.62)`,
        glow: `hsla(${node.hue}, 26%, 36%, 0.08)`,
        ring: `hsla(${node.hue}, 54%, 56%, 0.12)`,
        line: `hsla(${node.hue}, 30%, 42%, 0.14)`,
    }
}

function applyNodeTheme(el, node) {
    const theme = getNodeTheme(node)
    el.style.setProperty("--node-bg-start", theme.bgStart)
    el.style.setProperty("--node-bg-end", theme.bgEnd)
    el.style.setProperty("--node-border", theme.border)
    el.style.setProperty("--node-text", theme.text)
    el.style.setProperty("--node-meta", theme.meta)
    el.style.setProperty("--node-glow", theme.glow)
    el.style.setProperty("--node-ring", theme.ring)
}

function getParentFocusId(node) {
    if (!node?.parentId || node.parentId === hierarchy.rootId) return null
    return node.parentId
}

function shouldFoldWhenLeaving(node) {
    return Boolean(node && ["domain", "category", "group", "measure"].includes(node.type) && node.tableExpandable)
}

function getNodeTypeLabel(node) {
    if (!node) return ""
    return {
        domain: "Domain",
        category: "Category",
        group: "Cluster",
        measure: "Scale",
        dimension: "Dimension",
        item: "Item",
    }[node.type]
}

function getNodeBadge(node) {
    if (!node) return ""

    if (node.type === "domain" || node.type === "category" || node.type === "group") {
        return pluralize(node.measureCount, "scale")
    }
    if (node.type === "measure") {
        return pluralize(node.totalItems || 0, "item")
    }
    if (node.type === "dimension") {
        return pluralize(node.itemCount || 0, "item")
    }
    return getNodeTypeLabel(node)
}

function getNodeSize(node, isCenter) {
    const sizes = {
        root: { w: 118, h: 118 },
        domain: { w: isCenter ? 200 : 158, h: isCenter ? 124 : 108 },
        category: { w: isCenter ? 188 : 148, h: isCenter ? 116 : 98 },
        group: { w: isCenter ? 176 : 140, h: isCenter ? 108 : 88 },
        measure: { w: isCenter ? 222 : 182, h: isCenter ? 126 : 96 },
        dimension: { w: isCenter ? 200 : 166, h: isCenter ? 116 : 90 },
        item: { w: isCenter ? 260 : 218, h: isCenter ? 128 : 86 },
    }
    return sizes[node?.type || "root"]
}

function buildOrbitPositions(count, centerX, centerY, baseRadius, ringGap, maxPerRing) {
    const positions = []
    let remaining = count
    let ringIndex = 0
    let cursor = 0

    while (remaining > 0) {
        const ringCount = Math.min(maxPerRing + ringIndex * 2, remaining)
        const radius = baseRadius + ringIndex * ringGap
        for (let i = 0; i < ringCount; i++) {
            const angleOffset = ringIndex % 2 === 0 ? 0 : Math.PI / Math.max(ringCount, 1)
            const angle = -Math.PI / 2 + angleOffset + (2 * Math.PI * i) / ringCount
            positions[cursor++] = {
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            }
        }
        remaining -= ringCount
        ringIndex++
    }

    return positions
}

function setNodePosition(el, x, y, size) {
    el.style.left = `${x}px`
    el.style.top = `${y}px`
    el.style.setProperty("--node-width", `${size.w}px`)
    el.style.setProperty("--node-height", `${size.h}px`)
}

function createSvgLine(x1, y1, x2, y2, node) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
    const theme = getNodeTheme(node)
    line.setAttribute("x1", x1)
    line.setAttribute("y1", y1)
    line.setAttribute("x2", x2)
    line.setAttribute("y2", y2)
    line.setAttribute("class", "network-link")
    line.setAttribute("stroke", theme.line)
    return line
}

function createPreviewSvgLine(x1, y1, x2, y2, node) {
    const line = createSvgLine(x1, y1, x2, y2, node)
    line.classList.add("network-preview-link")
    return line
}

function setAnimatedDelay(el, delay) {
    el.style.setProperty("--enter-delay", `${delay}ms`)
}

function scheduleRenderNetwork(frameDelay = 1) {
    if (networkRenderFrame) {
        cancelAnimationFrame(networkRenderFrame)
        networkRenderFrame = 0
    }

    const tick = (remainingFrames) => {
        networkRenderFrame = requestAnimationFrame(() => {
            if (remainingFrames > 1) {
                tick(remainingFrames - 1)
                return
            }

            networkRenderFrame = 0
            renderNetwork()
        })
    }

    tick(Math.max(1, frameDelay))
}

function getPreviewRingRadius(stageWidth, stageHeight) {
    return Math.max(120, Math.min(stageWidth, stageHeight) * 0.46)
}

function renderPreviewNodes(
    nodesLayer,
    links,
    anchorX,
    anchorY,
    stageCenterX,
    stageCenterY,
    stageWidth,
    stageHeight,
    parentNode,
    previewNodes,
    parentIndex,
) {
    const limitedPreviewNodes = previewNodes.slice(0, 12)
    if (limitedPreviewNodes.length === 0) return

    const outwardX = anchorX - stageCenterX
    const outwardY = anchorY - stageCenterY
    const baseAngle = Math.atan2(outwardY || -1, outwardX || 0)
    const previewRadius = getPreviewRingRadius(stageWidth, stageHeight)
    const angularSpread = Math.min(1.2, 0.34 + limitedPreviewNodes.length * 0.1)
    const positions = limitedPreviewNodes.map((_, index) => {
        const offset =
            limitedPreviewNodes.length === 1 ? 0 : -angularSpread / 2 + (angularSpread * index) / (limitedPreviewNodes.length - 1)
        const angle = baseAngle + offset
        return {
            x: stageCenterX + previewRadius * Math.cos(angle),
            y: stageCenterY + previewRadius * Math.sin(angle),
        }
    })

    limitedPreviewNodes.forEach((previewNode, index) => {
        const previewEl = document.createElement("button")
        previewEl.className = `network-preview-node node-${previewNode.type}`
        previewEl.type = "button"
        previewEl.title = previewNode.label
        previewEl.setAttribute("aria-label", `Jump to ${previewNode.label}`)
        previewEl.style.left = `${positions[index].x}px`
        previewEl.style.top = `${positions[index].y}px`
        applyNodeTheme(previewEl, previewNode)
        setAnimatedDelay(previewEl, 70 + parentIndex * 40 + index * 18)
        previewEl.addEventListener("click", () => handleNetworkNodeClick(previewNode.id))
        nodesLayer.appendChild(previewEl)
        const previewLine = createPreviewSvgLine(anchorX, anchorY, positions[index].x, positions[index].y, previewNode || parentNode)
        setAnimatedDelay(previewLine, 50 + parentIndex * 40 + index * 16)
        links.appendChild(previewLine)
    })
}

function buildBreadcrumbs(node) {
    const container = document.getElementById("network-breadcrumbs")
    if (!container) return

    const crumbs = [{ id: null, label: "All domains" }]
    let current = node
    const stack = []
    while (current && current.type !== "root") {
        stack.unshift({ id: current.id, label: current.label })
        current = getNode(current.parentId)
    }
    crumbs.push(...stack)

    container.innerHTML = crumbs
        .map((crumb, index) => {
            const active = index === crumbs.length - 1
            return `<button type="button" class="network-crumb${active ? " is-active" : ""}" data-target="${crumb.id || ""}">${escHtml(crumb.label)}</button>`
        })
        .join("")

    container.querySelectorAll(".network-crumb").forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.dataset.target || null
            networkCenterId = target
            renderNetwork()
        })
    })
}

function buildInspector(node, visibleChildren) {
    const inspector = document.getElementById("network-inspector")
    if (!inspector) return

    if (!node) {
        const domains = getNodeChildren(getNode(hierarchy.rootId), ["domain"])
        const totalMeasures = domains.reduce((sum, domain) => sum + domain.measureCount, 0)
        inspector.innerHTML = `
            <div class="network-inspector-topline">Overview</div>
            <h3 class="network-inspector-title">Browse from the domain layer</h3>
            <p class="network-inspector-body">The node view mirrors the table hierarchy. Click a domain to move it to the center, reveal its categories, and continue drilling down to dimensions and item wording.</p>
            <div class="network-stats">
                <span class="network-stat">${pluralize(domains.length, "domain")}</span>
                <span class="network-stat">${pluralize(totalMeasures, "scale")}</span>
            </div>
        `
        return
    }

    const parts = []
    const body = []

    if (node.type === "measure") {
        if (node.scale) body.push(`<p class="network-inspector-body"><strong>Response scale:</strong> ${escHtml(node.scale)}</p>`)
        if (node.instructions)
            body.push(
                `<p class="network-inspector-body"><strong>Instructions:</strong> ${escHtml(summarizeText(node.instructions, 260))}</p>`,
            )
        if (node.notes)
            body.push(`<p class="network-inspector-body"><strong>Notes:</strong> ${escHtml(summarizeText(node.notes, 260))}</p>`)
        if (node.references.length > 0)
            body.push(`<p class="network-inspector-body"><strong>References:</strong> ${escHtml(node.references.join("; "))}</p>`)
    } else if (node.type === "dimension") {
        body.push(`<p class="network-inspector-body">This dimension opens onto the exact item wording attached to the selected scale.</p>`)
    } else if (node.type === "item") {
        body.push(`<p class="network-inspector-body">${escHtml(node.label)}</p>`)
    } else {
        body.push(
            `<p class="network-inspector-body">${visibleChildren.length > 0 ? `This branch currently exposes ${pluralize(visibleChildren.length, "child node")}.` : "This branch is currently folded in the table view."}</p>`,
        )
    }

    const expansionState = node.tableExpandable ? (isTreeExpanded(node.id) ? "Expanded" : "Folded") : "Leaf"

    parts.push(`<div class="network-inspector-topline">${escHtml(getNodeTypeLabel(node))}</div>`)
    parts.push(`<h3 class="network-inspector-title">${escHtml(node.label)}</h3>`)
    parts.push(...body)
    parts.push(`
        <div class="network-stats">
            <span class="network-stat">${escHtml(getNodeBadge(node))}</span>
            <span class="network-stat">${escHtml(expansionState)}</span>
        </div>
    `)

    inspector.innerHTML = parts.join("")
}

function syncFocusedTableRow() {
    document.querySelectorAll("tr.is-network-focus").forEach((row) => {
        row.classList.remove("is-network-focus")
    })

    if (!networkCenterId) return

    const node = getNode(networkCenterId)
    const targetId = getTableAncestorId(node)
    if (!targetId || !isRowVisible(targetId)) return

    const row = getRowEl(targetId)
    if (row) row.classList.add("is-network-focus")
}

function handleNetworkNodeClick(nodeId) {
    const node = getNode(nodeId)
    if (!node) return

    if (nodeId === networkCenterId) {
        if (shouldFoldWhenLeaving(node)) {
            setTreeExpanded(node.id, false)
        }
        networkCenterId = getParentFocusId(node)
        renderNetwork()
        return
    }

    networkCenterId = nodeId

    if (node.tableExpandable && !isTreeExpanded(node.id)) {
        setTreeExpanded(node.id, true)
    }

    renderNetwork()
}

function renderNetwork() {
    const stage = document.getElementById("network-stage")
    const links = document.getElementById("network-links")
    const nodesLayer = document.getElementById("network-nodes")
    const title = document.getElementById("network-title")

    if (!stage || !links || !nodesLayer || !title) return

    normalizeNetworkCenter()

    const focusNode = networkCenterId ? getNode(networkCenterId) : null
    const visibleChildren = getVisibleNetworkChildren(focusNode)
    const stageRect = stage.getBoundingClientRect()
    const width = Math.round(stageRect.width)
    const height = Math.round(stageRect.height)

    if (width < 160 || height < 160) {
        scheduleRenderNetwork(2)
        return
    }

    const centerX = width / 2
    const centerY = height / 2
    const sizeUnit = Math.min(width, height)

    links.setAttribute("viewBox", `0 0 ${width} ${height}`)
    links.innerHTML = ""
    nodesLayer.innerHTML = ""

    title.textContent = focusNode ? focusNode.label : "Domains"
    buildBreadcrumbs(focusNode)
    buildInspector(focusNode, visibleChildren)

    if (!focusNode) {
        const core = document.createElement("div")
        core.className = "network-core"
        core.innerHTML = `<span class="network-core-label">Domains</span>`
        core.style.left = `${centerX}px`
        core.style.top = `${centerY}px`
        nodesLayer.appendChild(core)

        const positions = buildOrbitPositions(visibleChildren.length, centerX, centerY, Math.max(sizeUnit * 0.16, 110), 86, 6)
        visibleChildren.forEach((node, index) => {
            const nodeEl = document.createElement("button")
            const size = getNodeSize(node, false)
            nodeEl.type = "button"
            nodeEl.className = `network-node node-${node.type}`
            setNodePosition(nodeEl, positions[index].x, positions[index].y, size)
            applyNodeTheme(nodeEl, node)
            setAnimatedDelay(nodeEl, 60 + index * 45)
            nodeEl.innerHTML = `
                <span class="network-node-type">${escHtml(getNodeTypeLabel(node))}</span>
                <span class="network-node-label">${escHtml(node.label)}</span>
                <span class="network-node-meta">${escHtml(getNodeBadge(node))}</span>
            `
            nodeEl.addEventListener("click", () => handleNetworkNodeClick(node.id))
            nodesLayer.appendChild(nodeEl)
            const mainLine = createSvgLine(centerX, centerY, positions[index].x, positions[index].y, node)
            setAnimatedDelay(mainLine, 20 + index * 35)
            links.appendChild(mainLine)

            renderPreviewNodes(
                nodesLayer,
                links,
                positions[index].x,
                positions[index].y,
                centerX,
                centerY,
                width,
                height,
                node,
                getPreviewNetworkChildren(node),
                index,
            )
        })

        syncFocusedTableRow()
        return
    }

    const centerEl = document.createElement("button")
    const centerSize = getNodeSize(focusNode, true)
    centerEl.type = "button"
    centerEl.className = `network-node node-${focusNode.type} is-center${focusNode.tableExpandable && isTreeExpanded(focusNode.id) ? " is-expanded" : ""}`
    setNodePosition(centerEl, centerX, centerY, centerSize)
    applyNodeTheme(centerEl, focusNode)
    setAnimatedDelay(centerEl, 0)
    centerEl.innerHTML = `
        <span class="network-node-type">${escHtml(getNodeTypeLabel(focusNode))}</span>
        <span class="network-node-label">${escHtml(focusNode.label)}</span>
        <span class="network-node-meta">${escHtml(getNodeBadge(focusNode))}</span>
    `
    centerEl.addEventListener("click", () => handleNetworkNodeClick(focusNode.id))
    nodesLayer.appendChild(centerEl)

    const positions = buildOrbitPositions(
        visibleChildren.length,
        centerX,
        centerY,
        Math.max(sizeUnit * (focusNode.type === "measure" ? 0.28 : 0.24), 125),
        88,
        focusNode.type === "dimension" ? 7 : 6,
    )

    visibleChildren.forEach((node, index) => {
        const nodeEl = document.createElement("button")
        const size = getNodeSize(node, false)
        const expandedClass = node.tableExpandable && isTreeExpanded(node.id) ? " is-expanded" : ""
        const leafClass = getVisibleNetworkChildren(node).length === 0 ? " is-leaf" : ""

        nodeEl.type = "button"
        nodeEl.className = `network-node node-${node.type}${expandedClass}${leafClass}`
        setNodePosition(nodeEl, positions[index].x, positions[index].y, size)
        applyNodeTheme(nodeEl, node)
        setAnimatedDelay(nodeEl, 70 + index * 45)
        nodeEl.innerHTML = `
            <span class="network-node-type">${escHtml(getNodeTypeLabel(node))}</span>
            <span class="network-node-label">${escHtml(node.label)}</span>
            <span class="network-node-meta">${escHtml(getNodeBadge(node))}</span>
        `
        nodeEl.addEventListener("click", () => handleNetworkNodeClick(node.id))
        nodesLayer.appendChild(nodeEl)
        const mainLine = createSvgLine(centerX, centerY, positions[index].x, positions[index].y, node)
        setAnimatedDelay(mainLine, 30 + index * 35)
        links.appendChild(mainLine)

        renderPreviewNodes(
            nodesLayer,
            links,
            positions[index].x,
            positions[index].y,
            centerX,
            centerY,
            width,
            height,
            node,
            getPreviewNetworkChildren(node),
            index,
        )
    })

    syncFocusedTableRow()
}

// -- Controls -----------------------------------------------------------------

function setupControls() {
    document.getElementById("btn-expand-all")?.addEventListener("click", () => {
        document.querySelectorAll("tr[data-level]").forEach((row) => {
            row.style.display = ""
        })

        document.querySelectorAll(".row-domain, .row-category, .row-group, .row-measure.has-detail").forEach((row) => {
            setExpandedAppearance(row, true)
        })

        document.querySelectorAll(".row-detail").forEach((row) => {
            row.style.display = ""
        })

        renderNetwork()
    })

    document.getElementById("btn-collapse-all")?.addEventListener("click", () => {
        document.querySelectorAll("tr[data-level]").forEach((row) => {
            const level = parseInt(row.dataset.level, 10)
            row.style.display = level === 0 ? "" : "none"
            setExpandedAppearance(row, false)
        })

        document.querySelectorAll(".row-detail").forEach((row) => {
            row.style.display = "none"
        })

        renderNetwork()
    })
}

// -- Init ---------------------------------------------------------------------

buildHierarchyModel()
buildTable()
resetTable()
setupSearch()
setupControls()
initNetworkPanel()
scheduleRenderNetwork(2)
