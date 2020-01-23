/* globals customElements */
import {LitElement, html, css} from '../vendor/lit-element/lit-element'
import {classMap} from '../vendor/lit-element/lit-html/directives/class-map'
import _get from 'lodash.get'
import * as bg from './bg-process-rpc'
import buttonResetCSS from './navbar/button-reset.css'
import './navbar/location'
import './navbar/inpage-find'

class ShellWindowNavbar extends LitElement {
  static get properties () {
    return {
      activeTabIndex: {type: Number},
      activeTab: {type: Object},
      isUpdateAvailable: {type: Boolean, attribute: 'is-update-available'},
      numWatchlistNotifications: {type: Number, attribute: 'num-watchlist-notifications'},
      isBrowserMenuOpen: {type: Boolean}
    }
  }

  constructor () {
    super()
    this.activeTabIndex = -1
    this.activeTab = null
    this.isUpdateAvailable = false
    this.numWatchlistNotifications = 0
    this.isBrowserMenuOpen = false
  }

  get canGoBack () {
    return _get(this, 'activeTab.canGoBack')
  }

  get canGoForward () {
    return _get(this, 'activeTab.canGoForward')
  }

  get canGoUp () {
    var url = _get(this, 'activeTab.url', '')
    try {
      var urlp = new URL(url)
      if (urlp.pathname !== '/') return true
      if (urlp.search) return true
      if (urlp.hash) return true
      return false
    } catch (e) {
      return false
    }
  }

  get isLoading () {
    return _get(this, 'activeTab.isLoading')
  }

  get isInsecure () {
    return _get(this, 'activeTab.url', '').startsWith('http:') || _get(this, 'activeTab.loadError.isInsecureResponse')
  }

  focusLocation () {
    this.shadowRoot.querySelector('shell-window-navbar-location').focusLocation()
  }

  // rendering
  // =

  render () {
    return html`
      <link rel="stylesheet" href="beaker://assets/font-awesome.css">
      <div class="buttons" style="padding-right: 0">
        ${this.backBtn}
        ${this.forwardBtn}
        ${this.reloadBtn}
        ${this.updogBtn}
        ${this.shortcutBtn}
      </div>
      <shell-window-navbar-location
        class=${classMap({insecure: this.isInsecure})}
        .activeTabIndex="${this.activeTabIndex}"
        url="${_get(this, 'activeTab.url', '')}"
        title="${_get(this, 'activeTab.title', '')}"
        siteTitle="${_get(this, 'activeTab.siteTitle', '')}"
        driveDomain="${_get(this, 'activeTab.driveDomain', '')}"
        ?writable=${_get(this, 'activeTab.writable', false)}
        peers="${_get(this, 'activeTab.peers', 0)}"
        ?canInstall=${_get(this, 'activeTab.canInstall', false)}
        ?isInstalled=${_get(this, 'activeTab.isInstalled', false)}
        zoom="${_get(this, 'activeTab.zoom', '')}"
        .loadError=${_get(this, 'activeTab.loadError', null)}
        donate-link-href="${_get(this, 'activeTab.donateLinkHref') || ''}"
        available-alternative="${_get(this, 'activeTab.availableAlternative') || ''}"
        ?is-live-reloading=${_get(this, 'activeTab.isLiveReloading')}
        ?is-bookmarked=${_get(this, 'activeTab.isBookmarked', false)}
      ></shell-window-navbar-location>
      <shell-window-navbar-inpage-find
        .activeTabIndex="${this.activeTabIndex}"
        ?is-active=${_get(this, 'activeTab.isInpageFindActive', false)}
        query="${_get(this, 'activeTab.currentInpageFindString', '')}"
        active-match="${_get(this, 'activeTab.currentInpageFindResults.activeMatchOrdinal', '0')}"
        num-matches="${_get(this, 'activeTab.currentInpageFindResults.matches', '0')}"
      ></shell-window-navbar-inpage-find>
      <div class="buttons" style="padding-left: 4px">
        ${this.watchlistBtn}
        ${this.browserMenuBtn}
      </div>
    `
  }

  get backBtn () {
    return html`
      <button class="nav-arrow-btn" ?disabled=${!this.canGoBack} @click=${this.onClickGoBack} style="margin: 0px 2px">
        <svg
          class="icon nav-arrow"
          width="9" height="16"
          viewBox="0 0 9 16"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          style="position: relative; left: -2px;"
        >
          <g fill="none" stroke-linejoin="round">
            <polyline stroke-width="2" transform="translate(4.500000, 8.000000) scale(1, 1) translate(-4.500000, -8.000000) " points="8 1 1 8 8 15"/>
          </g>
        </svg>
      </button>
    `
  }

  get forwardBtn () {
    return html`
      <button class="nav-arrow-btn" ?disabled=${!this.canGoForward} @click=${this.onClickGoForward} style="margin: 0px 2px">
        <svg
          class="icon nav-arrow"
          width="9" height="16"
          viewBox="0 0 9 16"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g fill="none" stroke-linejoin="round">
            <polyline stroke-width="2" transform="translate(4.500000, 8.000000) scale(-1, 1) translate(-4.500000, -8.000000) " points="8 1 1 8 8 15"/>
          </g>
        </svg>
      </button>
    `
  }

  get reloadBtn () {
    if (this.isLoading) {
      return html`
        <button @click=${this.onClickStop} style="margin: 0px 2px">
          <svg
            class="icon close"
            width="12"
            height="12"
            viewBox="0 0 58 58"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <g id="svg-close" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
              <g transform="translate(4, 5)" stroke-width="10">
                <path d="M1.5,0.5 L48.5,47.5"/>
                <path d="M48.5,0 L1,48"/>
              </g>
            </g>
          </svg>
        </button>
      `
    }
    return html`
      <button @click=${this.onClickReload} style="margin: 0px 2px">
        <svg
          class="icon refresh"
          width="16"
          height="15"
          viewBox="0 0 16 15"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <g transform="translate(1.000000, 1.000000)" fill="none">
            <path d="M10.9451459,1.75753722 C9.78269142,0.66752209 8.21929978,0 6.5,0 C2.91014913,0 0,2.91014913 0,6.5 C0,10.0898509 2.91014913,13 6.5,13 C9.00186057,13 11.173586,11.5865234 12.2601674,9.51457898" stroke-linecap="round"/>
            <polygon fill="#666666" points="14.2374369 4.98743687 9.64124279 4.63388348 13.8838835 0.391242789"/>
          </g>
        </svg>
      </button>
    `
  }

  get updogBtn () {
    return html`
      <button @click=${this.onClickUpdog} ?disabled=${!this.canGoUp} style="margin: 0 0 0 4px">
        <span class="fas fa-level-up-alt"></span>
      </button>
    `
  }

  get shortcutBtn () {
    return html`
      <button @click=${this.onClickShortcut} style="margin: 0 6px">
        <span class="fas fa-th"></span>
      </button>
    `
  }

  get watchlistBtn () {
    if (!this.numWatchlistNotifications) {
      return html``
    }
    return html`
      <button class="watchlist-btn" @click=${this.onClickWatchlistBtn} style="margin: 0px 2px">
        <span class="fas fa-eye"></span>
        <span class="badge">${this.numWatchlistNotifications}</span>
      </button>
    `
  }

  get browserMenuBtn () {
    const cls = classMap({pressed: this.isBrowserMenuOpen})
    return html`
      <button class=${cls} @click=${this.onClickBrowserMenu} style="margin: 0px 2px">
        ${this.isUpdateAvailable
          ? html`<span class="fas fa-arrow-alt-circle-up"></span>`
          : html`<span class="fa fa-bars"></span>`}
      </button>
    `
  }

  // events
  // =

  onClickGoBack (e) {
    bg.views.goBack(this.activeTabIndex)
  }

  onClickGoForward (e) {
    bg.views.goForward(this.activeTabIndex)
  }

  onClickStop (e) {
    bg.views.stop(this.activeTabIndex)
  }

  onClickReload (e) {
    bg.views.reload(this.activeTabIndex)
  }

  onClickShortcut (e) {
    // bg.views.showNavbarShortcutContextMenu('active')
    bg.views.loadURL('active', 'beaker://desktop/')
  }

  onClickUpdog (e) {
    var url = _get(this, 'activeTab.url', '')
    if (!url) return
    try {
      let urlp = new URL(url)
      let pathname = `/${urlp.pathname.split('/').filter(Boolean).slice(0, -1).join('/')}`
      url = urlp.origin + pathname
      bg.views.loadURL('active', url)
    } catch (e) {
      // ignore
    }
  }

  onClickWatchlistBtn (e) {
    this.numWatchlistNotifications = 0
    bg.views.createTab('beaker://watchlist', {setActive: true})
  }

  async onClickUsersMenu (e) {
    this.isUsersMenuOpen = true
    var rect = e.currentTarget.getClientRects()[0]
    await bg.views.toggleMenu('users', {
      bounds: {
        top: (rect.bottom|0),
        right: (rect.right|0)
      }
    })
    this.isUsersMenuOpen = false
  }

  async onClickBrowserMenu (e) {
    this.isBrowserMenuOpen = true
    await bg.views.toggleMenu('browser')
    this.isBrowserMenuOpen = false
  }
}
ShellWindowNavbar.styles = css`
:host {
  display: flex;
  background: var(--bg-foreground);
  height: 28px;
  padding: 6px 0;
  border-bottom: 1px solid var(--bg-background);
}

${buttonResetCSS}

button {
  width: 28px;
  position: relative;
}

button .fa,
button .far,
button .fas {
  font-size: 16px;
  color: #333;
}

button .fa-th {
  -webkit-text-stroke: 1px #fff;
  font-size: 14px;
}

svg.icon * {
  stroke: #666;
}

svg.icon.refresh {
  stroke-width: 1.75;
}

.buttons {
  display: flex;
  padding: 0 8px;
}

.fas.fa-level-up-alt {
  font-size: 15px;
  position: relative;
  top: -1px;
  color: #555;
}

.fas.fa-arrow-alt-circle-up {
  font-size: 20px;
  color: #67bf6b;
  -webkit-text-stroke: 1px #0eab0e;
}

.badge {
  position: absolute;
  left: 0px;
  top: 2px;
  font-size: 10px;
  border-radius: 8px;
  height: 15px;
  min-width: 10px;
  line-height: 14px;
  background: #0090ff;
  color: #fff;
  font-weight: bold;
  padding: 0 3px;
}
`
customElements.define('shell-window-navbar', ShellWindowNavbar)
