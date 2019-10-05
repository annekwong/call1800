import * as SIP from 'sip.js';

require('./main.scss');

const WS_SERVERS = 'wss://webrtc.call1800.org:7443';

const createDOM = () => {
  const el = document.createElement('div');
  el.classList.add('call1800-dialpad');
  el.classList.add('call1800-dialpad_invalid');
  el.innerHTML = `
  <audio id="remoteAudio"></audio>

  <span id="collapse" class="call1800-dialpad__collapse-button">
    <!-- Chevrons -->
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 284.929 284.929" style="enable-background:new 0 0 284.929 284.929;" xml:space="preserve">
    <g>
      <g>
        <path d="M17.128,167.872c1.903,1.902,4.093,2.854,6.567,2.854c2.474,0,4.664-0.952,6.567-2.854L142.466,55.666l112.208,112.206    c1.902,1.902,4.093,2.854,6.563,2.854c2.478,0,4.668-0.952,6.57-2.854l14.274-14.277c1.902-1.902,2.847-4.093,2.847-6.563    c0-2.475-0.951-4.665-2.847-6.567L149.028,7.419c-1.901-1.906-4.088-2.853-6.562-2.853s-4.665,0.95-6.567,2.853L2.856,140.464    C0.95,142.367,0,144.554,0,147.034c0,2.468,0.953,4.658,2.856,6.561L17.128,167.872z" fill="#FFFFFF"/>
        <path d="M149.028,117.055c-1.901-1.906-4.088-2.856-6.562-2.856s-4.665,0.953-6.567,2.856L2.856,250.1    C0.95,252.003,0,254.192,0,256.67c0,2.472,0.953,4.661,2.856,6.564l14.272,14.276c1.903,1.903,4.093,2.848,6.567,2.848    c2.474,0,4.664-0.951,6.567-2.848l112.204-112.209l112.208,112.209c1.902,1.903,4.093,2.852,6.563,2.852    c2.478,0,4.668-0.948,6.57-2.852l14.274-14.276c1.902-1.903,2.847-4.093,2.847-6.564c0-2.478-0.951-4.667-2.847-6.57    L149.028,117.055z" fill="#FFFFFF"/>
      </g>
    </g>
    </svg>
  </span>

  <div class="call1800-dialpad__status">
    <span class="call1800-dialpad__status-circle"></span>
    <span class="call1800-dialpad__status-text">Ready</span>
  </div>

  <div class="call1800-dialpad__number-row">
    <div class="call1800-dialpad__input">
      <select id="numberDropdown">
        <option>1800</option>
        <option>1888</option>
        <option>1877</option>
        <option>1866</option>
        <option>1855</option>
        <option>1844</option>
      </select>
      <input id="numberInput" type="text">
    </div>
    <div id="callHangup" class="call1800-dialpad__call-hangup">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 578.106 578.106" style="enable-background:new 0 0 578.106 578.106;" xml:space="preserve" width="512px" height="512px">
      <g>
        <g>
          <path d="M577.83,456.128c1.225,9.385-1.635,17.545-8.568,24.48l-81.396,80.781    c-3.672,4.08-8.465,7.551-14.381,10.404c-5.916,2.857-11.729,4.693-17.439,5.508c-0.408,0-1.635,0.105-3.676,0.309    c-2.037,0.203-4.689,0.307-7.953,0.307c-7.754,0-20.301-1.326-37.641-3.979s-38.555-9.182-63.645-19.584    c-25.096-10.404-53.553-26.012-85.376-46.818c-31.823-20.805-65.688-49.367-101.592-85.68    c-28.56-28.152-52.224-55.08-70.992-80.783c-18.768-25.705-33.864-49.471-45.288-71.299    c-11.425-21.828-19.993-41.616-25.705-59.364S4.59,177.362,2.55,164.51s-2.856-22.95-2.448-30.294    c0.408-7.344,0.612-11.424,0.612-12.24c0.816-5.712,2.652-11.526,5.508-17.442s6.324-10.71,10.404-14.382L98.022,8.756    c5.712-5.712,12.24-8.568,19.584-8.568c5.304,0,9.996,1.53,14.076,4.59s7.548,6.834,10.404,11.322l65.484,124.236    c3.672,6.528,4.692,13.668,3.06,21.42c-1.632,7.752-5.1,14.28-10.404,19.584l-29.988,29.988c-0.816,0.816-1.53,2.142-2.142,3.978    s-0.918,3.366-0.918,4.59c1.632,8.568,5.304,18.36,11.016,29.376c4.896,9.792,12.444,21.726,22.644,35.802    s24.684,30.293,43.452,48.653c18.36,18.77,34.68,33.354,48.96,43.76c14.277,10.4,26.215,18.053,35.803,22.949    c9.588,4.896,16.932,7.854,22.031,8.871l7.648,1.531c0.816,0,2.145-0.307,3.979-0.918c1.836-0.613,3.162-1.326,3.979-2.143    l34.883-35.496c7.348-6.527,15.912-9.791,25.705-9.791c6.938,0,12.443,1.223,16.523,3.672h0.611l118.115,69.768    C571.098,441.238,576.197,447.968,577.83,456.128z" fill="#FFFFFF"/>
        </g>
      </g>
      </svg>
    </div>
  </div>

  <div class="call1800-dialpad__keys">
    <div class="call1800-dialpad__keys-row">
      <div class="call1800-dialpad__key" data-key="1">1</div>
      <div class="call1800-dialpad__key" data-key="2">2</div>
      <div class="call1800-dialpad__key" data-key="3">3</div>
    </div>

    <div class="call1800-dialpad__keys-row">
      <div class="call1800-dialpad__key" data-key="4">4</div>
      <div class="call1800-dialpad__key" data-key="5">5</div>
      <div class="call1800-dialpad__key" data-key="6">6</div>
    </div>

    <div class="call1800-dialpad__keys-row">
      <div class="call1800-dialpad__key" data-key="7">7</div>
      <div class="call1800-dialpad__key" data-key="8">8</div>
      <div class="call1800-dialpad__key" data-key="9">9</div>
    </div>

    <div class="call1800-dialpad__keys-row">
      <div class="call1800-dialpad__key" data-key="*">*</div>
      <div class="call1800-dialpad__key" data-key="0">0</div>
      <div class="call1800-dialpad__key" data-key="#">#</div>
    </div>

  </div>

  <div class="call1800-dialpad__clear-actions">
    <div id="deleteAll" class="call1800-dialpad__clear-all">clear</div>
    <div id="deleteLast" class="call1800-dialpad__clear-last">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 612 612" style="enable-background:new 0 0 612 612;" xml:space="preserve">
      <g>
        <g id="backspace">
          <path d="M561,76.5H178.5c-17.85,0-30.6,7.65-40.8,22.95L0,306l137.7,206.55c10.2,12.75,22.95,22.95,40.8,22.95H561    c28.05,0,51-22.95,51-51v-357C612,99.45,589.05,76.5,561,76.5z M484.5,397.8l-35.7,35.7L357,341.7l-91.8,91.8l-35.7-35.7    l91.8-91.8l-91.8-91.8l35.7-35.7l91.8,91.8l91.8-91.8l35.7,35.7L392.7,306L484.5,397.8z" fill="#FFFFFF"/>
        </g>
      </g>
      </svg>
    </div>
  </div>

  <div class="call1800-dialpad__powered-by">
    Powered by <a href="https://call1800.org/?ref=${document.origin}" target="_blank">call1800.org</a>
  </div>
  `;
  return el;
};

class Dialpad {
  constructor(options = {}) {
    this.el = createDOM();
    this.sip = null;
    this.calling = false;

    this.collapseBtn = this.el.querySelector('#collapse');
    this.callHangUpBtn = this.el.querySelector('#callHangup');
    this.numberDropdown = this.el.querySelector('#numberDropdown');
    this.numberInput = this.el.querySelector('#numberInput');
    this.dialpadKeys = this.el.querySelectorAll('.call1800-dialpad__key');
    this.deleteLastBtn = this.el.querySelector('#deleteLast');
    this.deleteAllBtn = this.el.querySelector('#deleteAll');
    this.remoteAudio = this.el.querySelector('#remoteAudio');
    this.statusText = this.el.querySelector('.call1800-dialpad__status-text');

    if (options.closed) {
      this.close();
    }

    this.numberInput.addEventListener('input', (e) => {
      if (this.calling) this.sip.sendDTMF(e.data);
      this.numberInput.value = this.numberInput.value.replace(/[^0-9\*\#]+/, '').substring(7, -1);
      this.validate()
    });

    this.numberDropdown.addEventListener('change', () => {
      this.numberInput.focus();
    });

    this.el.addEventListener('click', (event) => {
      if (event.target === this.numberDropdown) return;
      this.numberInput.focus();
    });

    this.collapseBtn.addEventListener('click', () => {
      this.toggle();
    });

    this.callHangUpBtn.addEventListener('click', () => {
      this.callOrHangUp();
    });

    this.dialpadKeys.forEach(k => k.addEventListener('click', (e) => {
      if (this.calling) {
        this.sip.sendDTMF(e.target.attributes['data-key'].value);
        return;
      }
      if (this.numberInput.value.length === 7) return;
      const key = e.target.attributes['data-key'].value;
      this.numberInput.value += key;
      this.validate()
    }));

    this.deleteLastBtn.addEventListener('click', () => {
      if (this.calling) return;
      this.numberInput.value = this.numberInput.value.slice(0, -1);
      this.validate();
    });

    this.deleteAllBtn.addEventListener('click', () => {
      if (this.calling) return;
      this.numberInput.value = '';
      this.validate();
    });
  }

  render() {
    document.body.append(this.el);
  }

  validate() {
    if (this.numberInput.value.length === 7) this.readyStatus();
    else this.invalidStatus();
  }

  open() {
    this.el.classList.remove('call1800-dialpad_collapsed');
  }

  close() {
    this.el.classList.add('call1800-dialpad_collapsed');
  }

  toggle() {
    this.el.classList.toggle('call1800-dialpad_collapsed');
  }

  // updateDialpadNumber(number) {
  //   if (number.length > 7) return;
  //
  //   this.numberInput.value = number;
  // }

  callOrHangUp() {
    // call and hangup method will immediately return if called unnecessarily
    // so we can just call them both and one will be triggered
    if (this.calling) this.hangUp();
    else this.call();
  }

  call(number = null) {
    // Already calling
    if (this.calling) return;

    if (number) {
      Array.from(this.numberDropdown.options).map((o) => {
        const newOption = o;
        newOption.selected = (o.value === number.slice(0, 4));
        return newOption;
      });

      this.numberInput.value = number.slice(4);
    }

    // Check number length
    const n = this.numberDropdown.value + this.numberInput.value;
    if (n.length !== 11) return;

    this.open();
    this.calling = true;

    const options = {
      media: {
        remote: {
          audio: this.remoteAudio,
        },
      },
      ua: {
        wsServers: WS_SERVERS,
        traceSip: false,
        register: false,
      },
    };

    this.sip = new SIP.WebRTC.Simple(options);
    this.sip.call(n);

    this.establishingConnectionStatus();

    // this.sip.on('connecting', () => {
    //   // ESTABLISHING CONNECTION
    // });

    this.sip.on('connected', () => {
      // CALL IN PROGRESS
      this.callInProgressStatus();
    });

    this.sip.on('ended', () => {
      this.calling = false;
      this.readyStatus();
    });
  }

  clearStatusClasses() {
    this.el.classList.remove('call1800-dialpad_call-in-progress');
    this.el.classList.remove('call1800-dialpad_establishing-connection');
    this.el.classList.remove('call1800-dialpad_ready');
    this.el.classList.remove('call1800-dialpad_invalid');
  }

  callInProgressStatus() {
    this.clearStatusClasses();
    this.el.classList.add('call1800-dialpad_call-in-progress');
    this.statusText.innerHTML = 'Call in progress';
  }

  establishingConnectionStatus() {
    this.clearStatusClasses();
    this.el.classList.add('call1800-dialpad_establishing-connection');
    this.statusText.innerHTML = 'Establishing connection';
  }

  invalidStatus() {
    this.clearStatusClasses();
    this.el.classList.add('call1800-dialpad_invalid');
    this.statusText.innerHTML = 'Ready';
  }

  readyStatus() {
    this.clearStatusClasses();
    this.el.classList.add('call1800-dialpad_ready');
    this.statusText.innerHTML = 'Ready';
  }

  hangUp() {
    this.sip.hangup();
    this.calling = false;
    this.readyStatus();
  }
}

if (typeof window !== 'undefined') window.Dialpad = Dialpad;

export default Dialpad;
