/* ==========================
TAB CONFIG
========================== */

const TABS = [

  {
    id: "dashboard",
    label: "Dashboard"
  },

  {
    id: "margin",
    label: "Margin Trend"
  },

  {
    id: "stock",
    label: "Stock Trend"
  },

  {
    id: "verification",
    label: "Paid Verification"
  }

];

/* ==========================
RENDER TABS
========================== */

export function renderTabs(
  activeTab,
  onChange
) {

  const container =
    document.getElementById(
      "tabsBar"
    );

  if (!container) {
    return;
  }

  container.innerHTML =
    TABS.map(
      tab => `

        <button
          class="
            tab-btn
            ${
              activeTab === tab.id
                ? "active"
                : ""
            }
          "
          data-tab-id="${tab.id}"
        >

          ${tab.label}

        </button>

      `
    ).join("");

  bindTabEvents(
    onChange
  );

}

/* ==========================
TAB EVENTS
========================== */

function bindTabEvents(
  onChange
) {

  const buttons =
    document.querySelectorAll(
      ".tab-btn"
    );

  buttons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          const tabId =
            button.dataset.tabId;

          onChange(
            tabId
          );

        }
      );

    }
  );

}