/**
 * BLE Device Explorer - Core Application
 * Web Bluetooth API progressive web application
 */

// Register Service Worker using relative path
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .then((registration) => {
        console.log('[SW] Service Worker registered successfully. Scope:', registration.scope);
      })
      .catch((error) => {
        console.error('[SW] Service Worker registration failed:', error);
      });
  });
}

// In-App PWA Install Prompt handling
let deferredInstallPrompt = null;
const pwaInstallBtn = document.getElementById('pwaInstallBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] beforeinstallprompt event intercepted.');
  e.preventDefault();
  deferredInstallPrompt = e;
  if (pwaInstallBtn) {
    pwaInstallBtn.style.display = 'inline-flex';
  }
});

if (pwaInstallBtn) {
  pwaInstallBtn.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    console.log('[PWA] User response to install prompt:', outcome);
    deferredInstallPrompt = null;
    pwaInstallBtn.style.display = 'none';
  });
}

window.addEventListener('appinstalled', () => {
  console.log('[PWA] BLE Device Explorer was successfully installed.');
  if (pwaInstallBtn) {
    pwaInstallBtn.style.display = 'none';
  }
});

// Bluetooth SIG Known Standard Services Dictionary
const KNOWN_SERVICES = {
  '00001800-0000-1000-8000-00805f9b34fb': 'Generic Access',
  '00001801-0000-1000-8000-00805f9b34fb': 'Generic Attribute',
  '00001802-0000-1000-8000-00805f9b34fb': 'Immediate Alert',
  '00001803-0000-1000-8000-00805f9b34fb': 'Link Loss',
  '00001804-0000-1000-8000-00805f9b34fb': 'Tx Power',
  '00001805-0000-1000-8000-00805f9b34fb': 'Current Time Service',
  '00001806-0000-1000-8000-00805f9b34fb': 'Reference Time Update',
  '00001807-0000-1000-8000-00805f9b34fb': 'Next DST Change Service',
  '00001808-0000-1000-8000-00805f9b34fb': 'Glucose',
  '00001809-0000-1000-8000-00805f9b34fb': 'Health Thermometer',
  '0000180a-0000-1000-8000-00805f9b34fb': 'Device Information',
  '0000180d-0000-1000-8000-00805f9b34fb': 'Heart Rate',
  '0000180e-0000-1000-8000-00805f9b34fb': 'Phone Alert Status',
  '0000180f-0000-1000-8000-00805f9b34fb': 'Battery Service',
  '00001810-0000-1000-8000-00805f9b34fb': 'Blood Pressure',
  '00001811-0000-1000-8000-00805f9b34fb': 'Alert Notification Service',
  '00001812-0000-1000-8000-00805f9b34fb': 'Human Interface Device',
  '00001813-0000-1000-8000-00805f9b34fb': 'Scan Parameters',
  '00001814-0000-1000-8000-00805f9b34fb': 'Running Speed and Cadence',
  '00001815-0000-1000-8000-00805f9b34fb': 'Automation IO',
  '00001816-0000-1000-8000-00805f9b34fb': 'Cycling Speed and Cadence',
  '00001818-0000-1000-8000-00805f9b34fb': 'Cycling Power',
  '00001819-0000-1000-8000-00805f9b34fb': 'Location and Navigation',
  '0000181a-0000-1000-8000-00805f9b34fb': 'Environmental Sensing',
  '0000181b-0000-1000-8000-00805f9b34fb': 'Body Composition',
  '0000181c-0000-1000-8000-00805f9b34fb': 'User Data',
  '0000181d-0000-1000-8000-00805f9b34fb': 'Weight Scale',
  '0000181e-0000-1000-8000-00805f9b34fb': 'Bond Management',
  '0000181f-0000-1000-8000-00805f9b34fb': 'Continuous Glucose Monitoring',
  '00001820-0000-1000-8000-00805f9b34fb': 'Internet Protocol Support',
  '00001821-0000-1000-8000-00805f9b34fb': 'Indoor Positioning',
  '00001822-0000-1000-8000-00805f9b34fb': 'Pulse Oximeter',
  '00001823-0000-1000-8000-00805f9b34fb': 'Fitness Machine',
  '00001824-0000-1000-8000-00805f9b34fb': 'Mesh Provisioning',
  '00001825-0000-1000-8000-00805f9b34fb': 'Mesh Proxy',
  '00001826-0000-1000-8000-00805f9b34fb': 'Reconnection Configuration',
  '00001827-0000-1000-8000-00805f9b34fb': 'Insulin Delivery',
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e': 'Nordic UART Service'
};

// Bluetooth SIG Known Standard Characteristics Dictionary
const KNOWN_CHARACTERISTICS = {
  '00002a00-0000-1000-8000-00805f9b34fb': 'Device Name',
  '00002a01-0000-1000-8000-00805f9b34fb': 'Appearance',
  '00002a02-0000-1000-8000-00805f9b34fb': 'Peripheral Privacy Flag',
  '00002a03-0000-1000-8000-00805f9b34fb': 'Reconnection Address',
  '00002a04-0000-1000-8000-00805f9b34fb': 'Peripheral Preferred Connection Parameters',
  '00002a05-0000-1000-8000-00805f9b34fb': 'Service Changed',
  '00002a06-0000-1000-8000-00805f9b34fb': 'Alert Level',
  '00002a07-0000-1000-8000-00805f9b34fb': 'Tx Power Level',
  '00002a08-0000-1000-8000-00805f9b34fb': 'Date Time',
  '00002a19-0000-1000-8000-00805f9b34fb': 'Battery Level',
  '00002a24-0000-1000-8000-00805f9b34fb': 'Model Number String',
  '00002a25-0000-1000-8000-00805f9b34fb': 'Serial Number String',
  '00002a26-0000-1000-8000-00805f9b34fb': 'Firmware Revision String',
  '00002a27-0000-1000-8000-00805f9b34fb': 'Hardware Revision String',
  '00002a28-0000-1000-8000-00805f9b34fb': 'Software Revision String',
  '00002a29-0000-1000-8000-00805f9b34fb': 'Manufacturer Name String',
  '00002a37-0000-1000-8000-00805f9b34fb': 'Heart Rate Measurement',
  '00002a38-0000-1000-8000-00805f9b34fb': 'Body Sensor Location',
  '00002a39-0000-1000-8000-00805f9b34fb': 'Heart Rate Control Point',
  '00002a6e-0000-1000-8000-00805f9b34fb': 'Temperature',
  '00002a6f-0000-1000-8000-00805f9b34fb': 'Humidity',
  '6e400002-b5a3-f393-e0a9-e50e24dcca9e': 'Nordic UART RX (Write)',
  '6e400003-b5a3-f393-e0a9-e50e24dcca9e': 'Nordic UART TX (Notify)'
};

// Standard Bluetooth SIG 16-bit UUID numbers (0x1800 to 0x183B)
// Using numeric 16-bit UUID aliases and canonical 128-bit strings avoids Chromium's "Invalid Service name" TypeError.
const STANDARD_16BIT_SERVICES = [];
for (let id = 0x1800; id <= 0x183b; id++) {
  STANDARD_16BIT_SERVICES.push(id);
}

// Well-known vendor 128-bit lowercase UUIDs
const KNOWN_VENDOR_SERVICES = [
  '6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART Service
  '0000fee0-0000-1000-8000-00805f9b34fb', // Huami / Mi Band
  '0000fe95-0000-1000-8000-00805f9b34fb', // Xiaomi
  '00001530-1212-efde-1523-785feabcd123', // Nordic DFU
  'e95d0753-251d-470a-a062-fa1922dfa9a8', // micro:bit Accelerometer
  'e95d127b-251d-470a-a062-fa1922dfa9a8', // micro:bit IO Pin
  'e95d93af-251d-470a-a062-fa1922dfa9a8', // micro:bit LED
  'e95dd91d-251d-470a-a062-fa1922dfa9a8'  // micro:bit UART
];

// Sanitize optionalServices to ensure 100% standard UUID aliases accepted by Chromium
function getSanitizedOptionalServices() {
  const allServices = [...STANDARD_16BIT_SERVICES, ...KNOWN_VENDOR_SERVICES];
  if (typeof window !== 'undefined' && window.BluetoothUUID && typeof window.BluetoothUUID.getService === 'function') {
    const verified = [];
    for (const service of allServices) {
      try {
        verified.push(window.BluetoothUUID.getService(service));
      } catch (err) {
        console.warn('[BLE] Skipping unverified service:', service, err);
      }
    }
    return verified.length > 0 ? verified : allServices;
  }
  return allServices;
}

const OPTIONAL_SERVICES = getSanitizedOptionalServices();

// DOM Element References
const scanButton = document.getElementById('scanButton');
const scanBtnText = document.getElementById('scanBtnText');
const statusPanel = document.getElementById('statusPanel');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const deviceBar = document.getElementById('deviceBar');
const connectedDeviceName = document.getElementById('connectedDeviceName');
const connectedDeviceId = document.getElementById('connectedDeviceId');
const disconnectBtn = document.getElementById('disconnectBtn');
const servicesCounter = document.getElementById('servicesCounter');
const servicesCountNum = document.getElementById('servicesCountNum');
const servicesContainer = document.getElementById('servicesContainer');
const compatWarning = document.getElementById('compatWarning');
const iframeNotice = document.getElementById('iframeNotice');
const openTabBtn = document.getElementById('openTabBtn');

// State Variables
let currentDevice = null;
let currentGattServer = null;

// Check if running in an iframe with restricted Permissions Policy
function checkIframePermissions() {
  if (openTabBtn) {
    openTabBtn.href = window.location.href;
  }

  const inIframe = window.self !== window.top;
  let policyBlocked = false;

  try {
    if (document.permissionsPolicy && typeof document.permissionsPolicy.allowsFeature === 'function') {
      policyBlocked = !document.permissionsPolicy.allowsFeature('bluetooth');
    } else if (document.featurePolicy && typeof document.featurePolicy.allowsFeature === 'function') {
      policyBlocked = !document.featurePolicy.allowsFeature('bluetooth');
    }
  } catch (e) {
    console.warn('[BLE] Permissions policy check exception:', e);
  }

  if (inIframe || policyBlocked) {
    console.info('[BLE] Running inside iframe context (Permissions policy restricted). Showing direct tab button.');
    if (iframeNotice) {
      iframeNotice.style.display = 'flex';
    }
  }
}

// Initial Browser Web Bluetooth Compatibility Verification
function checkBluetoothSupport() {
  checkIframePermissions();

  if (!('bluetooth' in navigator)) {
    console.warn('[BLE] navigator.bluetooth is not supported in this browser.');
    if (compatWarning) compatWarning.style.display = 'block';
    if (scanButton) {
      scanButton.disabled = true;
      scanButton.title = 'Web Bluetooth is not supported in this browser';
    }
    updateStatus('error', 'Web Bluetooth is not supported by your browser.');
    return false;
  }
  return true;
}

// Update UI Status Panel
function updateStatus(type, message) {
  if (!statusPanel || !statusText) return;
  statusPanel.className = `status-panel status-${type}`;
  statusText.textContent = message;

  if (type === 'connecting') {
    statusIndicator.textContent = '◌';
  } else if (type === 'connected') {
    statusIndicator.textContent = '✔';
  } else if (type === 'error') {
    statusIndicator.textContent = '✕';
  } else {
    statusIndicator.textContent = '●';
  }
}

// Convert DataView bytes to Hex String (e.g. "0A 1F 3C")
function formatBytesToHex(dataView) {
  if (!dataView || dataView.byteLength === 0) {
    return '(empty)';
  }
  const hexParts = [];
  for (let i = 0; i < dataView.byteLength; i++) {
    const byte = dataView.getUint8(i);
    hexParts.push(byte.toString(16).padStart(2, '0').toUpperCase());
  }
  return hexParts.join(' ');
}

// Try to decode readable ASCII / UTF-8 text from DataView
function formatBytesToAscii(dataView) {
  if (!dataView || dataView.byteLength === 0) return '';
  try {
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const text = decoder.decode(dataView);
    // Only return if it contains mostly printable characters
    const isPrintable = /^[\x20-\x7E\s]*$/.test(text) && text.trim().length > 0;
    if (isPrintable) {
      return `"${text.trim()}"`;
    }
  } catch {
    // Non-text data
  }
  return '';
}

// Friendly UUID Name Resolvers
function getServiceFriendlyName(uuid) {
  const normalized = uuid.toLowerCase();
  if (KNOWN_SERVICES[normalized]) {
    return KNOWN_SERVICES[normalized];
  }
  // Check if standard 16-bit format: 0000XXXX-0000-1000-8000-00805f9b34fb
  const match = normalized.match(/^0000([0-9a-f]{4})-0000-1000-8000-00805f9b34fb$/);
  if (match) {
    return `Standard Service (0x${match[1].toUpperCase()})`;
  }
  return 'Custom / Vendor Service';
}

function getCharacteristicFriendlyName(uuid) {
  const normalized = uuid.toLowerCase();
  if (KNOWN_CHARACTERISTICS[normalized]) {
    return KNOWN_CHARACTERISTICS[normalized];
  }
  // Check if standard 16-bit format: 0000XXXX-0000-1000-8000-00805f9b34fb
  const match = normalized.match(/^0000([0-9a-f]{4})-0000-1000-8000-00805f9b34fb$/);
  if (match) {
    return `Standard Characteristic (0x${match[1].toUpperCase()})`;
  }
  return 'Custom Characteristic';
}

// Disconnect handler
function onDisconnected() {
  console.log('[BLE] Device disconnected event triggered.');
  updateStatus('idle', 'Device disconnected. Click Scan Devices to reconnect.');
  if (deviceBar) deviceBar.style.display = 'none';
  if (scanButton) {
    scanButton.disabled = false;
    scanButton.classList.remove('is-loading');
  }
  if (scanBtnText) scanBtnText.textContent = 'Scan Devices';
  currentDevice = null;
  currentGattServer = null;
}

// Disconnect button click
if (disconnectBtn) {
  disconnectBtn.addEventListener('click', () => {
    if (currentDevice && currentDevice.gatt && currentDevice.gatt.connected) {
      console.log('[BLE] User initiated disconnect.');
      currentDevice.gatt.disconnect();
    } else {
      onDisconnected();
    }
  });
}

// Main BLE Scan & Exploration Workflow
async function startBleScan() {
  if (!checkBluetoothSupport()) return;

  // Set button loading state
  scanButton.disabled = true;
  scanButton.classList.add('is-loading');
  scanBtnText.textContent = 'Connecting...';
  updateStatus('connecting', 'Requesting Bluetooth Low Energy device picker...');

  // Reset previously displayed services
  if (servicesContainer) servicesContainer.innerHTML = '';
  if (servicesCounter) servicesCounter.style.display = 'none';
  if (deviceBar) deviceBar.style.display = 'none';

  console.log('[BLE] Requesting device with acceptAllDevices: true and wide optionalServices...');

  try {
    // Step 1: Request Bluetooth Device
    const safeServices = getSanitizedOptionalServices();
    console.log(`[BLE] Requesting device with ${safeServices.length} standard optionalServices.`);
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: safeServices
    });

    console.log('[BLE] Device selected by user:', device.name || 'Unnamed', 'ID:', device.id);
    currentDevice = device;

    // Listen for disconnection
    device.removeEventListener('gattserverdisconnected', onDisconnected);
    device.addEventListener('gattserverdisconnected', onDisconnected);

    // Update UI with selected device
    updateStatus('connecting', `Connecting to GATT server on "${device.name || 'Unnamed Device'}"...`);

    // Step 2: Connect to GATT server
    console.log('[BLE] Connecting to GATT server...');
    const server = await device.gatt.connect();
    currentGattServer = server;
    console.log('[BLE] GATT server connected successfully.');

    // Show device information card
    if (connectedDeviceName) connectedDeviceName.textContent = device.name || 'Unnamed BLE Device';
    if (connectedDeviceId) connectedDeviceId.textContent = `ID: ${device.id}`;
    if (deviceBar) deviceBar.style.display = 'flex';

    updateStatus('connecting', 'Connected! Discovering primary GATT services...');

    // Step 3: Enumerate Primary Services
    console.log('[BLE] Calling server.getPrimaryServices()...');
    let services = [];
    try {
      services = await server.getPrimaryServices();
      console.log(`[BLE] Primary services found: ${services.length}`);
    } catch (servicesError) {
      console.error('[BLE] getPrimaryServices error:', servicesError);
      updateStatus('error', `Failed to enumerate services: ${servicesError.message}`);
      scanButton.disabled = false;
      scanButton.classList.remove('is-loading');
      scanBtnText.textContent = 'Scan Devices';
      return;
    }

    // Update Services Counter
    if (servicesCounter && servicesCountNum) {
      servicesCountNum.textContent = services.length.toString();
      servicesCounter.style.display = 'block';
    }

    if (services.length === 0) {
      updateStatus('connected', 'Connected, but no exposed primary services were found in filter scope.');
      const emptyNote = document.createElement('div');
      emptyNote.className = 'status-panel status-idle';
      emptyNote.textContent = 'No primary services accessible under current filter rules.';
      servicesContainer.appendChild(emptyNote);
      scanButton.disabled = false;
      scanButton.classList.remove('is-loading');
      scanBtnText.textContent = 'Scan Devices';
      return;
    }

    updateStatus('connected', `Connected to "${device.name || 'Device'}". Enumerated ${services.length} services.`);

    // Step 4: For each service, enumerate characteristics and read values
    for (let sIdx = 0; sIdx < services.length; sIdx++) {
      const service = services[sIdx];
      const serviceUuid = service.uuid;
      const serviceFriendlyName = getServiceFriendlyName(serviceUuid);
      console.log(`[BLE] [Service ${sIdx + 1}/${services.length}] Exploring: ${serviceFriendlyName} (${serviceUuid})`);

      // Create Service Card
      const card = document.createElement('section');
      card.className = 'service-card';

      const cardHeader = document.createElement('div');
      cardHeader.className = 'service-header';
      cardHeader.innerHTML = `
        <div class="service-name">${serviceFriendlyName}</div>
        <div class="service-uuid">UUID: ${serviceUuid}</div>
      `;
      card.appendChild(cardHeader);

      const cardBody = document.createElement('div');
      cardBody.className = 'service-body';

      // Enumerate characteristics with safe isolated try/catch
      let characteristics = [];
      try {
        console.log(`[BLE] Fetching characteristics for service: ${serviceUuid}`);
        characteristics = await service.getCharacteristics();
        console.log(`[BLE] Found ${characteristics.length} characteristics for service ${serviceUuid}`);
      } catch (charEnumError) {
        console.warn(`[BLE] Failed to get characteristics for service ${serviceUuid}:`, charEnumError);
        const charErrorRow = document.createElement('div');
        charErrorRow.className = 'characteristic-row';
        charErrorRow.innerHTML = `
          <div class="char-read-error">
            Could not enumerate characteristics for this service: ${charEnumError.message || 'Access restricted'}
          </div>
        `;
        cardBody.appendChild(charErrorRow);
      }

      if (characteristics.length === 0 && !cardBody.hasChildNodes()) {
        const noChars = document.createElement('div');
        noChars.className = 'characteristic-row';
        noChars.innerHTML = `<span style="color: var(--color-text-muted); font-size: 0.85rem;">No characteristics exposed by this service.</span>`;
        cardBody.appendChild(noChars);
      }

      // Process each characteristic
      for (const char of characteristics) {
        const charUuid = char.uuid;
        const charFriendlyName = getCharacteristicFriendlyName(charUuid);
        const props = char.properties;

        console.log(`[BLE] Processing Characteristic: ${charFriendlyName} (${charUuid})`, {
          read: props.read,
          write: props.write,
          writeWithoutResponse: props.writeWithoutResponse,
          notify: props.notify,
          indicate: props.indicate
        });

        // Characteristic Row
        const row = document.createElement('div');
        row.className = 'characteristic-row';

        // Title and UUID
        const metaWrap = document.createElement('div');
        metaWrap.className = 'char-meta';

        const titleWrap = document.createElement('div');
        titleWrap.className = 'char-title-wrap';
        titleWrap.innerHTML = `
          <div class="char-name">${charFriendlyName}</div>
          <div class="char-uuid">${charUuid}</div>
        `;
        metaWrap.appendChild(titleWrap);

        // Property Badges
        const badgesWrap = document.createElement('div');
        badgesWrap.className = 'badges-wrap';

        if (props.read) {
          const badge = document.createElement('span');
          badge.className = 'badge badge-read';
          badge.textContent = 'READ';
          badgesWrap.appendChild(badge);
        }
        if (props.write || props.writeWithoutResponse) {
          const badge = document.createElement('span');
          badge.className = 'badge badge-write';
          badge.textContent = props.writeWithoutResponse ? 'WRITE NO RESP' : 'WRITE';
          badgesWrap.appendChild(badge);
        }
        if (props.notify) {
          const badge = document.createElement('span');
          badge.className = 'badge badge-notify';
          badge.textContent = 'NOTIFY';
          badgesWrap.appendChild(badge);
        }
        if (props.indicate) {
          const badge = document.createElement('span');
          badge.className = 'badge badge-indicate';
          badge.textContent = 'INDICATE';
          badgesWrap.appendChild(badge);
        }

        metaWrap.appendChild(badgesWrap);
        row.appendChild(metaWrap);

        // If READ is supported, attempt to read value in isolated try/catch
        if (props.read) {
          const valBox = document.createElement('div');
          valBox.className = 'char-value-box';

          try {
            console.log(`[BLE] Calling readValue() on characteristic ${charUuid}...`);
            const dataView = await char.readValue();
            const hexString = formatBytesToHex(dataView);
            const asciiPreview = formatBytesToAscii(dataView);

            console.log(`[BLE] Read success for ${charUuid}:`, hexString, asciiPreview);

            let valHtml = `
              <div class="char-value-label">Read Value (Raw Bytes):</div>
              <div class="char-hex-data">${hexString}</div>
            `;
            if (asciiPreview) {
              valHtml += `<div class="char-text-preview">Text preview: ${asciiPreview}</div>`;
            }
            valBox.innerHTML = valHtml;
          } catch (readError) {
            console.warn(`[BLE] Could not read characteristic ${charUuid}:`, readError);
            valBox.innerHTML = `
              <div class="char-value-label">Read Value:</div>
              <div class="char-read-error">Could not read: ${readError.message || 'Operation failed'}</div>
            `;
          }

          row.appendChild(valBox);
        }

        cardBody.appendChild(row);
      }

      card.appendChild(cardBody);
      servicesContainer.appendChild(card);
    }

    console.log('[BLE] Exploration completed successfully.');
  } catch (error) {
    console.error('[BLE] Operation error:', error);

    // Handle user cancellation gracefully
    if (error.name === 'NotFoundError' || error.message.includes('User cancelled') || error.message.includes('cancelled')) {
      console.log('[BLE] User cancelled the Bluetooth device picker dialog.');
      updateStatus('idle', 'Selection cancelled. Click Scan Devices to try again.');
    } else if (error.name === 'SecurityError' || error.message.includes('permissions policy') || error.message.includes('disallowed')) {
      console.warn('[BLE] SecurityError: Permissions policy restriction detected.');
      updateStatus('error', 'Bluetooth is disallowed inside this embedded preview iframe. Click "Open Direct Tab" above.');
      if (iframeNotice) {
        iframeNotice.style.display = 'flex';
        iframeNotice.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      updateStatus('error', `Connection error: ${error.message || 'Unknown error occurred.'}`);
    }
  } finally {
    // Always re-enable scan button
    scanButton.disabled = false;
    scanButton.classList.remove('is-loading');
    scanBtnText.textContent = 'Scan Devices';
  }
}

// Attach click listener to Scan button
if (scanButton) {
  scanButton.addEventListener('click', startBleScan);
}

// Initial status check on page load
checkBluetoothSupport();
