// ── Helpers ─────────────────────────────────────────────────────────────────

function escHtml(str) {
    if (str == null) return ""
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
}

function countDomainMeasures(domain) {
    return domain.categories.reduce((s, c) => s + c.groups.reduce((s2, g) => s2 + g.measures.length, 0), 0)
}

function countCatMeasures(cat) {
    return cat.groups.reduce((s, g) => s + g.measures.length, 0)
}

function formatDims(dims) {
    if (!dims || dims.length === 0) return '<span class="cell-empty">—</span>'
    const names = dims.map((d) => d.name)
    const shown = names.slice(0, 2)
    const extra = names.length - shown.length
    let html = shown.map((n) => `<span class="dim-pill">${escHtml(n)}</span>`).join("")
    if (extra > 0) html += ` <span class="dim-more">+${extra} more</span>`
    return html
}

function formatRefs(refs) {
    if (!refs || refs.length === 0) return '<span class="cell-empty">—</span>'
    const fullTitle = escHtml(refs.join("; "))
    const shown = escHtml(refs[0])
    const extra = refs.length > 1 ? ` <span class="ref-more" title="${fullTitle}">+${refs.length - 1}</span>` : ""
    return `<span title="${fullTitle}">${shown}</span>${extra}`
}

// ── Table builder ────────────────────────────────────────────────────────────

function buildTable() {
    const tbody = document.querySelector("#compendium-table tbody")

    // Domain hues spaced 120° apart for maximum chromatic distinction
    const DOMAIN_HUES = [175, 295, 55]

    questionnaireCompendium.forEach((domain, di) => {
        const domainId = `d${di}`
        const domH = DOMAIN_HUES[di % DOMAIN_HUES.length]

        // Domain row — visible and expanded by default
        const dRow = document.createElement("tr")
        dRow.className = `row-domain dom-${di} expanded`
        dRow.dataset.id = domainId
        dRow.dataset.level = "0"
        dRow.innerHTML = `<td colspan="5">
            <span class="toggle-icon">▼</span>
            <span class="row-label">${escHtml(domain.domain)}</span>
            <span class="count-badge">${countDomainMeasures(domain)} scales</span>
        </td>`
        dRow.addEventListener("click", () => toggleRow(domainId))
        tbody.appendChild(dRow)

        domain.categories.forEach((cat, ci) => {
            const catId = `d${di}c${ci}`
            // Category hue: gradient ±15° around domain hue across all categories
            const numCats = domain.categories.length
            const catH = domH + (ci - (numCats - 1) / 2) * (30 / Math.max(numCats - 1, 1))

            // Category row — visible (domain expanded), collapsed
            const cRow = document.createElement("tr")
            cRow.className = `row-category dom-${di}`
            cRow.dataset.id = catId
            cRow.dataset.parent = domainId
            cRow.dataset.level = "1"
            cRow.style.cssText = `--cat-bg:hsl(${catH},60%,35%);--cat-hov:hsl(${catH},60%,42%);`
            cRow.innerHTML = `<td colspan="5">
                <span class="toggle-icon">▶</span>
                <span class="row-label">${escHtml(cat.category)}</span>
                <span class="count-badge">${countCatMeasures(cat)} scales</span>
            </td>`
            cRow.addEventListener("click", () => toggleRow(catId))
            tbody.appendChild(cRow)

            cat.groups.forEach((group, gi) => {
                const groupId = `d${di}c${ci}g${gi}`

                // Group row — hidden until category expanded
                // Groups use same hue as category, progressively darker lightness
                const numGroups = cat.groups.length
                const gBgL = numGroups > 1 ? Math.round(88 - gi * (12 / (numGroups - 1))) : 84
                const gRow = document.createElement("tr")
                gRow.className = `row-group dom-${di}`
                gRow.dataset.id = groupId
                gRow.dataset.parent = catId
                gRow.dataset.level = "2"
                gRow.style.cssText =
                    [
                        `--g-bg:hsl(${catH},45%,${gBgL}%)`,
                        `--g-txt:hsl(${catH},70%,22%)`,
                        `--g-bdr:hsl(${catH},40%,${gBgL - 8}%)`,
                        `--g-hov:hsl(${catH},45%,${gBgL - 6}%)`,
                        "display:none",
                    ].join(";") + ";"
                gRow.innerHTML = `<td colspan="5">
                    <span class="toggle-icon">▶</span>
                    <span class="row-label">${escHtml(group.group)}</span>
                    <span class="count-badge">${group.measures.length} scale${group.measures.length !== 1 ? "s" : ""}</span>
                </td>`
                gRow.addEventListener("click", () => toggleRow(groupId))
                tbody.appendChild(gRow)

                // Sort measures ascending by item count before rendering
                const sortedMeasures = [...group.measures].sort((a, b) => (a.total_items || 0) - (b.total_items || 0))
                sortedMeasures.forEach((measure, mi) => {
                    const measureId = `d${di}c${ci}g${gi}m${mi}`
                    const hasItems = measure.dimensions && measure.dimensions.some((d) => d.items && d.items.length > 0)
                    const hasNotes = measure.notes && measure.notes.trim() !== ""
                    const hasInstructions = measure.instructions && measure.instructions.trim() !== ""
                    const hasDetail = hasItems || hasNotes || hasInstructions

                    // Measure row — hidden until group expanded
                    const mRow = document.createElement("tr")
                    mRow.className = `row-measure dom-${di}` + (hasDetail ? " has-detail" : "")
                    mRow.dataset.id = measureId
                    mRow.dataset.parent = groupId
                    mRow.dataset.level = "3"
                    mRow.style.display = "none"

                    // All measures share a uniform light pastel of the domain hue
                    mRow.style.setProperty("--measure-bg", `hsl(${domH}, 20%, 97%)`)

                    const shortTag = measure.short_name ? `<span class="short-name">${escHtml(measure.short_name)}</span>` : ""
                    const toggleEl = hasDetail ? '<span class="toggle-icon">▶</span>' : '<span class="toggle-placeholder"></span>'

                    mRow.innerHTML = `
                        <td class="col-name">
                            <div class="name-cell">
                                ${toggleEl}
                                <span class="measure-name">${escHtml(measure.name)}</span>
                                ${shortTag}
                            </div>
                        </td>
                        <td class="col-n">${measure.total_items}</td>
                        <td class="col-scale">${escHtml(measure.scale || "—")}</td>
                        <td class="col-dims">${formatDims(measure.dimensions)}</td>
                        <td class="col-refs">${formatRefs(measure.references)}</td>
                    `

                    if (hasDetail) {
                        mRow.addEventListener("click", () => toggleMeasureDetail(measureId))
                    }
                    tbody.appendChild(mRow)

                    // Detail row — shown when measure expanded
                    if (hasDetail) {
                        const detailRow = document.createElement("tr")
                        detailRow.className = `row-detail dom-${di}`
                        detailRow.dataset.parent = measureId
                        detailRow.style.display = "none"

                        let detailHtml = ""
                        if (hasNotes) {
                            detailHtml += `<div class="detail-notes">${escHtml(measure.notes)}</div>`
                        }
                        if (hasInstructions) {
                            detailHtml += `<div class="detail-instructions"><span class="detail-instructions-label">Instructions:</span> ${escHtml(measure.instructions)}</div>`
                        }
                        if (hasItems) {
                            measure.dimensions
                                .filter((d) => d.items && d.items.length > 0)
                                .forEach((dim) => {
                                    detailHtml += `
                                        <div class="detail-dim-block">
                                            <div class="detail-dim-name">${escHtml(dim.name)}</div>
                                            <ul class="detail-items">
                                                ${dim.items.map((item) => `<li>${escHtml(item)}</li>`).join("")}
                                            </ul>
                                        </div>`
                                })
                        }

                        detailRow.innerHTML = `<td colspan="5"><div class="detail-content">${detailHtml}</div></td>`
                        tbody.appendChild(detailRow)
                    }
                })
            })
        })
    })
}

// ── Toggle logic ─────────────────────────────────────────────────────────────

function toggleRow(rowId) {
    const row = document.querySelector(`[data-id="${rowId}"]`)
    if (!row) return
    const expanded = row.classList.contains("expanded")
    const icon = row.querySelector(".toggle-icon")

    if (expanded) {
        row.classList.remove("expanded")
        if (icon) icon.textContent = "▶"
        collapseDescendants(rowId)
    } else {
        row.classList.add("expanded")
        if (icon) icon.textContent = "▼"
        document.querySelectorAll(`[data-parent="${rowId}"]`).forEach((child) => {
            child.style.display = ""
        })
    }
}

function toggleMeasureDetail(measureId) {
    const row = document.querySelector(`[data-id="${measureId}"]`)
    if (!row) return
    const expanded = row.classList.contains("expanded")
    const icon = row.querySelector(".toggle-icon")

    if (expanded) {
        row.classList.remove("expanded")
        if (icon) icon.textContent = "▶"
        document.querySelectorAll(`[data-parent="${measureId}"]`).forEach((d) => {
            d.style.display = "none"
        })
    } else {
        row.classList.add("expanded")
        if (icon) icon.textContent = "▼"
        document.querySelectorAll(`[data-parent="${measureId}"]`).forEach((d) => {
            d.style.display = ""
        })
    }
}

// Recursively hide all descendants and reset their state
function collapseDescendants(rowId) {
    document.querySelectorAll(`[data-parent="${rowId}"]`).forEach((child) => {
        child.style.display = "none"
        if (child.classList.contains("expanded")) {
            child.classList.remove("expanded")
            const icon = child.querySelector(".toggle-icon")
            if (icon) icon.textContent = "▶"
        }
        // Recurse only for rows that have an id (i.e. not leaf detail rows)
        if (child.dataset.id) {
            collapseDescendants(child.dataset.id)
        }
    })
}

// ── Search ───────────────────────────────────────────────────────────────────

function setupSearch() {
    const input = document.getElementById("search-input")
    input.addEventListener("input", () => {
        const q = input.value.toLowerCase().trim()
        if (q === "") {
            resetTable()
        } else {
            filterTable(q)
        }
    })
}

function filterTable(q) {
    // Hide everything first
    document.querySelectorAll("tr[data-level], .row-detail").forEach((r) => {
        r.style.display = "none"
    })

    // Find matching measure rows and collect their ancestor IDs
    const visibleAncestors = new Set()

    document.querySelectorAll(".row-measure").forEach((row) => {
        const name = (row.querySelector(".measure-name")?.textContent || "").toLowerCase()
        const abbr = (row.querySelector(".short-name")?.textContent || "").toLowerCase()
        if (name.includes(q) || abbr.includes(q)) {
            row.style.display = ""
            // Walk up the ancestor chain
            let pid = row.dataset.parent
            while (pid) {
                visibleAncestors.add(pid)
                const parentRow = document.querySelector(`[data-id="${pid}"]`)
                pid = parentRow ? parentRow.dataset.parent : null
            }
        }
    })

    // Show and mark ancestor rows as expanded
    document.querySelectorAll(".row-domain, .row-category, .row-group").forEach((row) => {
        if (visibleAncestors.has(row.dataset.id)) {
            row.style.display = ""
            row.classList.add("expanded")
            const icon = row.querySelector(".toggle-icon")
            if (icon) icon.textContent = "▼"
        }
    })
}

function resetTable() {
    // Hide detail rows
    document.querySelectorAll(".row-detail").forEach((r) => {
        r.style.display = "none"
    })

    // Restore initial visibility: domains expanded (categories visible), rest hidden
    document.querySelectorAll("tr[data-level]").forEach((row) => {
        const level = parseInt(row.dataset.level)
        if (level === 0) {
            row.style.display = ""
            row.classList.add("expanded")
            const icon = row.querySelector(".toggle-icon")
            if (icon) icon.textContent = "▼"
        } else if (level === 1) {
            row.style.display = ""
            row.classList.remove("expanded")
            const icon = row.querySelector(".toggle-icon")
            if (icon) icon.textContent = "▶"
        } else {
            row.style.display = "none"
            row.classList.remove("expanded")
        }
    })
}

// ── Expand / Collapse All ────────────────────────────────────────────────────

function setupControls() {
    document.getElementById("btn-expand-all").addEventListener("click", () => {
        // Show all rows with a level (not detail rows)
        document.querySelectorAll("tr[data-level]").forEach((row) => {
            row.style.display = ""
        })
        // Mark all parent rows as expanded
        document.querySelectorAll(".row-domain, .row-category, .row-group").forEach((row) => {
            row.classList.add("expanded")
            const icon = row.querySelector(".toggle-icon")
            if (icon) icon.textContent = "▼"
        })
    })

    document.getElementById("btn-collapse-all").addEventListener("click", () => {
        document.querySelectorAll("tr[data-level]").forEach((row) => {
            const level = parseInt(row.dataset.level)
            if (level > 0) row.style.display = "none"
            row.classList.remove("expanded")
            const icon = row.querySelector(".toggle-icon")
            if (icon) icon.textContent = "▶"
        })
        document.querySelectorAll(".row-detail").forEach((r) => {
            r.style.display = "none"
        })
    })
}

// ── Init ─────────────────────────────────────────────────────────────────────

buildTable()
setupSearch()
setupControls()
