window.__ModuleLoader__.load({
  id: '@local/dsh-skins',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'skins';
    const STORE_KEY = 'dsh-skins:state:v1';
    /** Longest edge a chosen file is downscaled to before it is stored. */
    const MAX_SIDE = 2560;
    /** Refuse a wallpaper larger than this; IndexedDB is roomy but not unlimited. */
    const MAX_BLOB_BYTES = 12 * 1024 * 1024;
    /** IndexedDB database and object store holding the wallpaper binary. */
    const DB_NAME = 'dsh-skins';
    const DB_STORE = 'assets';
    const WALLPAPER_KEY = 'wallpaper';
    /** Alpha below this marks a sampled pixel as transparent. */
    const ALPHA_THRESHOLD = 250;

    const DICT = {
      en: {
        section: 'Skins',
        lead: 'A skin recolors the interface on top of the light or dark appearance you chose. Your selection and wallpaper are stored in this browser.',
        palettes: 'Color skins',
        defaultSkin: 'Default',
        wallpaper: 'Background image',
        wallpaperHint: 'Fills the canvas behind panels and messages.',
        choose: 'Choose image…',
        processing: 'Processing…',
        urlPlaceholder: 'Paste an image URL',
        applyUrl: 'Apply',
        remove: 'Remove',
        dim: 'Dim',
        panel: 'Panel transparency',
        veil: 'Backdrop veil',
        panelShade: 'Panel shade',
        auto: 'Auto',
        darkGlass: 'Dark',
        lightGlass: 'Light',
        textTheme: 'Text colors',
        contrast: 'High contrast',
        soft: 'Soft',
        custom: 'Custom',
        primaryText: 'Body text',
        mutedText: 'Muted text',
        preview: 'Preview',
        note: 'Settings are stored in this browser only; images are downscaled before they are saved.',
        storageFull: 'That image is too large to store locally. Downscale it or paste a URL instead.',
        tooLarge: 'That image is larger than 12 MB after encoding. Pick a smaller one.',
        storageUnavailable: 'Browser storage is unavailable, so the image cannot be saved.',
        invalidUrl: 'Enter an http(s) image URL or a data image.',
        localPath: 'The browser cannot open a local file path. Use Choose image… instead.',
        decodeFailed: 'That file could not be read as an image.',
        readFailed: 'The image could not be read.',
        selected: 'Selected',
      },
      zh: {
        section: '皮肤',
        lead: '皮肤会叠加在你已选择的浅色/深色外观之上重新着色。所选皮肤与背景图保存在本机浏览器中。',
        palettes: '配色皮肤',
        defaultSkin: '默认',
        wallpaper: '背景图',
        wallpaperHint: '铺在面板与消息下方的画布上。',
        choose: '选择图片…',
        processing: '处理中…',
        urlPlaceholder: '粘贴图片链接',
        applyUrl: '应用',
        remove: '移除',
        dim: '暗化',
        panel: '面板通透度',
        veil: '遮罩浓度',
        panelShade: '面板明暗',
        auto: '自动',
        darkGlass: '深色',
        lightGlass: '浅色',
        textTheme: '文字配色',
        contrast: '高对比',
        soft: '柔和',
        custom: '自定义',
        primaryText: '正文',
        mutedText: '次级文字',
        preview: '预览',
        note: '设置仅保存在本机浏览器；图片保存前会自动压缩。',
        storageFull: '图片太大，无法保存在本地。请先压缩，或改用图片链接。',
        tooLarge: '图片编码后超过 12 MB，请换一张更小的。',
        storageUnavailable: '浏览器存储不可用，图片无法保存。',
        invalidUrl: '请输入 http(s) 图片链接或 data 图片。',
        localPath: '浏览器无法直接读取本地文件路径，请改用“选择图片…”。',
        decodeFailed: '无法把该文件解析为图片。',
        readFailed: '图片读取失败。',
        selected: '已选用',
      },
    };

    /** Token names a skin may recolor, in the alias layer the theme service exposes. */
    const TOKEN = {
      base: '--dsw-alias-bg-base',
      layer1: '--dsw-alias-bg-layer-1',
      layer2: '--dsw-alias-bg-layer-2',
      overlay: '--dsw-alias-bg-overlay',
      border1: '--dsw-alias-border-l1',
      border2: '--dsw-alias-border-l2',
      brand: '--dsw-alias-brand-primary',
      text: '--dsw-alias-label-primary',
      muted: '--dsw-alias-label-secondary',
      // Extra muted aliases some components use; harmless when a deployment never reads them.
      tertiary: '--dsw-alias-label-tertiary',
      disabled: '--dsw-alias-label-disabled',
      success: '--dsw-alias-state-success-primary',
      warn: '--dsw-alias-state-warn-primary',
      error: '--dsw-alias-state-error-primary',
      idle: '--dsw-alias-state-idle-primary',
      sidebar: '--dsw-specific-sidebar-fill',
    };

    /**
     * Glass surfaces used while a wallpaper is set. Surfaces and labels switch
     * together with the wallpaper's brightness rather than with light/dark, because
     * the text sits on the image: a dark wall takes light labels on dark glass, a
     * bright wall the opposite. The skin then contributes only its accents.
     */
    const GLASS = {
      lightText: {
        layer1: '#0f1316',
        layer2: '#0a0d0f',
        overlay: '#121619',
        sidebar: '#0c0f12',
        border1: 'rgba(255, 255, 255, 0.16)',
        border2: 'rgba(255, 255, 255, 0.28)',
        text: '#f5f8f9',
        muted: '#c6cfd4',
      },
      darkText: {
        layer1: '#ffffff',
        layer2: '#f3f5f6',
        overlay: '#ffffff',
        sidebar: '#f7f8f9',
        border1: 'rgba(0, 0, 0, 0.12)',
        border2: 'rgba(0, 0, 0, 0.22)',
        text: '#11161a',
        muted: '#4b555b',
      },
    };

    /** Surface alpha factors used while a wallpaper is set; the panel slider scales them. */
    const SURFACE_FACTORS = { layer1: 0.9, layer2: 0.8, overlay: 0.5, sidebar: 1 };
    /** Floors keep dense text areas readable at maximum transparency. */
    const SURFACE_FLOORS = { layer1: 0.28, layer2: 0.32, overlay: 0.55, sidebar: 0.28 };
    /** Upper bound of the panel-transparency setting. */
    const MAX_PANEL = 0.95;

    /**
     * Text palettes layered on the glass. `contrast` pushes muted copy close to the
     * body colour, because secondary labels are the first thing a photo swallows.
     */
    const TEXT_PRESETS = {
      contrast: {
        lightText: { primary: '#ffffff', muted: '#e3eaed' },
        darkText: { primary: '#000000', muted: '#2a3238' },
      },
      soft: {
        lightText: { primary: '#e6edef', muted: '#a7b4ba' },
        darkText: { primary: '#26303a', muted: '#5f6a70' },
      },
    };

    /** Text colours for one state: the preset, or the two colours the user picked. */
    function resolveTextColors(state, direction) {
      const glass = GLASS[direction] ?? GLASS.darkText;
      const preset = state.textTheme === 'contrast' || state.textTheme === 'soft' ? TEXT_PRESETS[state.textTheme] : null;
      const base = preset === null ? { primary: glass.text, muted: glass.muted } : preset[direction] ?? preset.darkText;
      if (state.textTheme !== 'custom') return base;
      const primary = typeof state.textPrimary === 'string' && /^#[0-9a-f]{6}$/i.test(state.textPrimary) ? state.textPrimary : base.primary;
      const muted = typeof state.textMuted === 'string' && /^#[0-9a-f]{6}$/i.test(state.textMuted) ? state.textMuted : base.muted;
      return { primary, muted };
    }

    /** Relative brightness of a `#rrggbb` colour, or `null` when the value is unusable. */
    function hexLuminance(color) {
      const value = String(color).trim().replace('#', '');
      if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
      const red = parseInt(value.slice(0, 2), 16) / 255;
      const green = parseInt(value.slice(2, 4), 16) / 255;
      const blue = parseInt(value.slice(4, 6), 16) / 255;
      return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    }

    /** A `null` palette leaves the built-in appearance untouched. */
    const SKINS = [
      { id: 'default', label: 'defaultSkin', light: null, dark: null },
      {
        id: 'aurora',
        label: { en: 'Aurora', zh: '极光青' },
        light: {
          base: '#f3f9fa',
          layer1: '#ffffff',
          layer2: '#e6f1f2',
          overlay: '#ffffff',
          border1: '#d5e6e8',
          border2: '#b5d2d5',
          brand: '#0d8f86',
          text: '#0a2b2c',
          muted: '#4c6b6c',
          success: '#12855b',
          warn: '#b7791f',
          error: '#c0392b',
          idle: '#8aa3a4',
          sidebar: '#edf6f7',
        },
        dark: {
          base: '#071417',
          layer1: '#0e2429',
          layer2: '#153138',
          overlay: '#102a30',
          border1: '#1d3b41',
          border2: '#2a4f57',
          brand: '#3fd6c4',
          text: '#e6f6f5',
          muted: '#9cb9b8',
          success: '#3ddc97',
          warn: '#e2b25a',
          error: '#ff7b72',
          idle: '#6b8a8b',
          sidebar: '#0a1d21',
        },
      },
      {
        id: 'sand',
        label: { en: 'Warm sand', zh: '暖沙' },
        light: {
          base: '#faf6ef',
          layer1: '#fffdf8',
          layer2: '#f2e9db',
          overlay: '#fffdf8',
          border1: '#e6d9c5',
          border2: '#d3c0a4',
          brand: '#b2662f',
          text: '#2e2318',
          muted: '#6b5a47',
          success: '#2f7d4f',
          warn: '#b7791f',
          error: '#b93a2f',
          idle: '#a99a86',
          sidebar: '#f6efe4',
        },
        dark: {
          base: '#16110c',
          layer1: '#221a13',
          layer2: '#2c2218',
          overlay: '#241b13',
          border1: '#3a2c20',
          border2: '#4e3b2a',
          brand: '#e0a06a',
          text: '#f5e9dc',
          muted: '#bda78f',
          success: '#6dcf8f',
          warn: '#e2b25a',
          error: '#ff8a7a',
          idle: '#8a7761',
          sidebar: '#120d09',
        },
      },
      {
        id: 'forest',
        label: { en: 'Forest', zh: '森林' },
        light: {
          base: '#f2f8f3',
          layer1: '#ffffff',
          layer2: '#e5f0e6',
          overlay: '#ffffff',
          border1: '#d3e4d5',
          border2: '#b2cfb7',
          brand: '#2f7d4f',
          text: '#0f2717',
          muted: '#4b6b55',
          success: '#2f7d4f',
          warn: '#b7791f',
          error: '#bf4133',
          idle: '#8ba394',
          sidebar: '#edf5ee',
        },
        dark: {
          base: '#0a130e',
          layer1: '#112019',
          layer2: '#182c21',
          overlay: '#12271c',
          border1: '#234032',
          border2: '#315544',
          brand: '#6dcf8f',
          text: '#e6f5ea',
          muted: '#9fb8a8',
          success: '#6dcf8f',
          warn: '#e2b25a',
          error: '#ff8a7a',
          idle: '#6f8a7b',
          sidebar: '#08110c',
        },
      },
      {
        id: 'violet',
        label: { en: 'Neon violet', zh: '霓虹紫' },
        light: {
          base: '#f7f4fc',
          layer1: '#ffffff',
          layer2: '#efe8f9',
          overlay: '#ffffff',
          border1: '#e0d6f2',
          border2: '#c6b4e4',
          brand: '#6d3fe0',
          text: '#1d1430',
          muted: '#5d4b7a',
          success: '#2f7d4f',
          warn: '#b7791f',
          error: '#c0392b',
          idle: '#a095b5',
          sidebar: '#f3eefb',
        },
        dark: {
          base: '#0b0816',
          layer1: '#151024',
          layer2: '#1f1735',
          overlay: '#181229',
          border1: '#2e2447',
          border2: '#413262',
          brand: '#b18cff',
          text: '#efe9ff',
          muted: '#a99bc7',
          success: '#6dcf8f',
          warn: '#e2b25a',
          error: '#ff8a7a',
          idle: '#7a6d94',
          sidebar: '#090613',
        },
      },
    ];

    function findSkin(id) {
      return SKINS.find((skin) => skin.id === id) ?? SKINS[0];
    }

    function clamp(value, min, max) {
      const number = Number(value);
      if (!Number.isFinite(number)) return min;
      return Math.min(max, Math.max(min, number));
    }

    /** `#rrggbb` → `rgba(r, g, b, a)`; other notations pass through unchanged. */
    function withAlpha(color, alpha) {
      const value = String(color).trim().replace('#', '');
      if (!/^[0-9a-fA-F]{6}$/.test(value)) return color;
      const red = parseInt(value.slice(0, 2), 16);
      const green = parseInt(value.slice(2, 4), 16);
      const blue = parseInt(value.slice(4, 6), 16);
      return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    /**
     * Build the token override layer.
     *
     * Without a wallpaper a skin replaces the palette outright. With one, the canvas
     * becomes transparent, surfaces become glass, and labels come from `textColors`,
     * so a dark wall gets light text (and dark glass) whatever the light/dark
     * appearance is, while the text palette stays independently selectable.
     */
    function buildTokens(skin, wallpaper, panel, direction, textColors) {
      const isDefault = skin.light === null || skin.dark === null;
      if (!wallpaper) {
        if (isDefault) return null;
        const plain = {};
        for (const [key, token] of Object.entries(TOKEN)) {
          const light = skin.light[key];
          const dark = skin.dark[key];
          if (typeof light !== 'string' || typeof dark !== 'string') continue;
          plain[token] = { light, dark };
        }
        return plain;
      }

      const glass = GLASS[direction] ?? GLASS.darkText;
      const text = textColors === undefined || textColors === null ? { primary: glass.text, muted: glass.muted } : textColors;
      const transparency = clamp(panel, 0, MAX_PANEL);
      const tokens = {
        [TOKEN.base]: { light: 'transparent', dark: 'transparent' },
        // Both scheme slots carry the same value: the text answers to the wallpaper.
        [TOKEN.text]: { light: text.primary, dark: text.primary },
        [TOKEN.muted]: { light: text.muted, dark: text.muted },
        [TOKEN.border1]: { light: glass.border1, dark: glass.border1 },
        [TOKEN.border2]: { light: glass.border2, dark: glass.border2 },
        // Tertiary and disabled labels are not in the documented token set, but the
        // sparse grey copy under plugin rows uses them; pin them to the muted colour
        // so the text palette really covers every grey the UI draws.
        [TOKEN.tertiary]: { light: text.muted, dark: text.muted },
        [TOKEN.disabled]: { light: text.muted, dark: text.muted },
      };

      for (const key of ['layer1', 'layer2', 'overlay', 'sidebar']) {
        const alpha = clamp(1 - transparency * SURFACE_FACTORS[key], SURFACE_FLOORS[key], 0.98);
        tokens[TOKEN[key]] = { light: withAlpha(glass[key], alpha), dark: withAlpha(glass[key], alpha) };
      }

      if (!isDefault) {
        const accent = direction === 'lightText' ? skin.dark : skin.light;
        for (const key of ['brand', 'success', 'warn', 'error', 'idle']) {
          tokens[TOKEN[key]] = { light: accent[key], dark: accent[key] };
        }
      }
      return tokens;
    }

    /** Escape a URL for a CSS `url("…")` string. */
    function cssUrl(value) {
      return String(value)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/[\r\n]+/g, '');
    }

    function isImageSource(value) {
      return /^(https?:\/\/|data:image\/)/i.test(String(value).trim());
    }

    /**
     * Average brightness of a wallpaper, 0 (black) to 1 (white), reduced to one
     * pixel. Cross-origin images without CORS headers taint the canvas, so the
     * result is `null` there and the caller falls back to the appearance scheme.
     */
    function measureLuminance(src) {
      return new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const context = canvas.getContext('2d');
            if (context === null) {
              resolve(null);
              return;
            }
            context.drawImage(image, 0, 0, 1, 1);
            const data = context.getImageData(0, 0, 1, 1).data;
            resolve((0.2126 * data[0] + 0.7152 * data[1] + 0.0722 * data[2]) / 255);
          } catch (error) {
            resolve(null);
          }
        };
        image.onerror = () => resolve(null);
        image.src = src;
      });
    }

    /**
     * Which way the glass reads: `lightText` on a dark wall, `darkText` on a bright
     * one. `shade` is the explicit panel choice; otherwise the measured brightness
     * decides, and an unmeasurable image falls back to the appearance scheme.
     */
    function resolveDirection(shade, luminance, scheme) {
      if (shade === 'dark') return 'lightText';
      if (shade === 'light') return 'darkText';
      if (typeof luminance === 'number' && Number.isFinite(luminance)) {
        return luminance < 0.5 ? 'lightText' : 'darkText';
      }
      return scheme === 'dark' ? 'lightText' : 'darkText';
    }

    /** Decode a picked file, honouring EXIF orientation where the browser supports it. */
    async function decodeImage(file) {
      if (typeof createImageBitmap === 'function') {
        try {
          const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
          return {
            source: bitmap,
            width: bitmap.width,
            height: bitmap.height,
            close: () => {
              try {
                bitmap.close();
              } catch (error) {
                // Already detached; nothing to release.
              }
            },
          };
        } catch (error) {
          // Fall through to the <img> path for formats createImageBitmap rejects.
        }
      }
      const url = URL.createObjectURL(file);
      try {
        const element = await new Promise((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error('decodeFailed'));
          image.src = url;
        });
        return {
          source: element,
          width: element.naturalWidth || element.width,
          height: element.naturalHeight || element.height,
          close: () => {},
        };
      } finally {
        URL.revokeObjectURL(url);
      }
    }

    /** Whether the scaled image keeps any pixel that is not fully opaque. */
    function hasTransparency(source, width, height) {
      try {
        const limit = 64;
        const scale = Math.min(1, limit / Math.max(width, height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const context = canvas.getContext('2d');
        if (context === null) return false;
        context.drawImage(source, 0, 0, canvas.width, canvas.height);
        const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let index = 3; index < data.length; index += 4) {
          if (data[index] < ALPHA_THRESHOLD) return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    }

    function canvasToBlob(canvas, type, quality) {
      return new Promise((resolve) => {
        if (typeof canvas.toBlob !== 'function') {
          resolve(null);
          return;
        }
        canvas.toBlob((blob) => resolve(blob ?? null), type, quality);
      });
    }

    /**
     * Downscale a picked file and encode it for storage. Images that use transparency
     * keep their alpha (WebP when the browser can produce it, PNG otherwise); every
     * other image becomes a high-quality JPEG. The longest edge is capped at
     * `MAX_SIDE`, and pixels are never upscaled.
     */
    async function prepareWallpaper(file) {
      const decoded = await decodeImage(file);
      try {
        const scale = Math.min(1, MAX_SIDE / Math.max(decoded.width, decoded.height));
        const width = Math.max(1, Math.round(decoded.width * scale));
        const height = Math.max(1, Math.round(decoded.height * scale));
        const transparent = hasTransparency(decoded.source, decoded.width, decoded.height);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (context === null) throw new Error('decodeFailed');
        context.drawImage(decoded.source, 0, 0, width, height);

        let blob = null;
        if (transparent) {
          blob = await canvasToBlob(canvas, 'image/webp', 0.92);
          if (blob !== null && blob.type !== 'image/webp') blob = null;
          if (blob === null) blob = await canvasToBlob(canvas, 'image/png');
        } else {
          blob = await canvasToBlob(canvas, 'image/jpeg', 0.92);
        }
        if (blob === null) throw new Error('decodeFailed');
        if (blob.size > MAX_BLOB_BYTES) throw new Error('tooLarge');
        return { blob, width, height, transparent };
      } finally {
        decoded.close();
      }
    }

    /** Open (and lazily create) the wallpaper database. */
    function openWallpaperDb() {
      return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
          reject(new Error('storageUnavailable'));
          return;
        }
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE);
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error('storageUnavailable'));
      });
    }

    /** Run one object-store operation and settle with the request's result. */
    function runWallpaperStore(mode, operation) {
      return openWallpaperDb().then(
        (db) =>
          new Promise((resolve, reject) => {
            const transaction = db.transaction(DB_STORE, mode);
            let request;
            try {
              request = operation(transaction.objectStore(DB_STORE));
            } catch (error) {
              db.close();
              reject(error);
              return;
            }
            transaction.oncomplete = () => {
              db.close();
              resolve(request === undefined ? undefined : request.result);
            };
            transaction.onerror = () => {
              db.close();
              reject(transaction.error ?? new Error('storageUnavailable'));
            };
            transaction.onabort = () => {
              db.close();
              reject(transaction.error ?? new Error('storageUnavailable'));
            };
          }),
      );
    }

    const readWallpaperBlob = () => runWallpaperStore('readonly', (store) => store.get(WALLPAPER_KEY));
    const writeWallpaperBlob = (blob) => runWallpaperStore('readwrite', (store) => store.put(blob, WALLPAPER_KEY));
    const deleteWallpaperBlob = () => runWallpaperStore('readwrite', (store) => store.delete(WALLPAPER_KEY));

    function defaultState() {
      return {
        skin: 'default',
        wallpaper: null,
        /** True when localStorage expects a wallpaper blob that has not been read yet. */
        wallpaperPending: false,
        dim: 0.18,
        panel: 0.35,
        veil: 0.55,
        shade: 'auto',
        textTheme: 'auto',
        textPrimary: null,
        textMuted: null,
        luminance: null,
        message: null,
      };
    }

    function loadState() {
      try {
        const raw = window.localStorage.getItem(STORE_KEY);
        if (raw === null) return defaultState();
        const parsed = JSON.parse(raw);
        if (parsed === null || typeof parsed !== 'object') return defaultState();
        const skin =
          typeof parsed.skin === 'string' && SKINS.some((entry) => entry.id === parsed.skin)
            ? parsed.skin
            : 'default';
        const stored = parsed.wallpaper !== null && typeof parsed.wallpaper === 'object' ? parsed.wallpaper : null;
        // Inline data URLs come from the pre-IndexedDB release and are migrated on boot.
        const wallpaper =
          stored !== null && typeof stored.value === 'string' && isImageSource(stored.value)
            ? { kind: stored.kind === 'url' ? 'url' : 'data', value: stored.value }
            : null;
        const wallpaperPending = wallpaper === null && stored !== null && stored.kind === 'blob';
        const legacy = parsed.panel === undefined;
        const storedDim = parsed.dim === undefined ? 0.18 : clamp(parsed.dim, 0, 0.85);
        // The old `text` field chose a text colour; its glass shade is the opposite one.
        const migratedShade = parsed.text === 'light' ? 'dark' : parsed.text === 'dark' ? 'light' : 'auto';
        const shade = parsed.shade === 'dark' || parsed.shade === 'light' ? parsed.shade : migratedShade;
        const textTheme =
          parsed.textTheme === 'contrast' || parsed.textTheme === 'soft' || parsed.textTheme === 'custom'
            ? parsed.textTheme
            : 'auto';
        const color = (value) => (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : null);
        const luminance =
          typeof parsed.luminance === 'number' && Number.isFinite(parsed.luminance)
            ? Math.min(1, Math.max(0, parsed.luminance))
            : null;
        return {
          skin,
          wallpaper,
          wallpaperPending,
          // A wallpaper saved before the panel slider existed was veiled by the old
          // defaults; start it lighter so the image reads, and let the slider raise it.
          dim: legacy ? Math.min(storedDim, 0.18) : storedDim,
          panel: legacy ? 0.35 : clamp(parsed.panel, 0, MAX_PANEL),
          veil: parsed.veil === undefined ? 0.55 : clamp(parsed.veil, 0, 0.9),
          shade,
          textTheme,
          textPrimary: color(parsed.textPrimary),
          textMuted: color(parsed.textMuted),
          luminance,
          message: null,
        };
      } catch (error) {
        return defaultState();
      }
    }

    /**
     * localStorage keeps only small values: a stored wallpaper is recorded by kind,
     * because the pixels themselves live in IndexedDB as a Blob.
     */
    function serializeState(state) {
      const wallpaper = state.wallpaper;
      return {
        skin: state.skin,
        wallpaper:
          wallpaper === null
            ? null
            : wallpaper.kind === 'url'
              ? { kind: 'url', value: wallpaper.value }
              : wallpaper.kind === 'data'
                ? { kind: 'data', value: wallpaper.value }
                : { kind: 'blob' },
        dim: state.dim,
        panel: state.panel,
        veil: state.veil,
        shade: state.shade,
        textTheme: state.textTheme,
        textPrimary: state.textPrimary,
        textMuted: state.textMuted,
        luminance: state.luminance,
      };
    }

    function saveState(state) {
      try {
        window.localStorage.setItem(STORE_KEY, JSON.stringify(serializeState(state)));
        return true;
      } catch (error) {
        return false;
      }
    }

    function createStore(initial) {
      let state = initial;
      const listeners = new Set();
      return {
        get: () => state,
        set(next) {
          if (next === state) return;
          state = next;
          for (const listener of [...listeners]) listener(state);
        },
        subscribe(listener) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
      };
    }

    const STYLE = `
      .dsh-skins { display: flex; flex-direction: column; gap: 16px; }
      .dsh-skins__lead { margin: 0; font-size: 13px; line-height: 1.65; color: var(--dsw-alias-label-secondary); }
      .dsh-skins__card {
        display: flex; flex-direction: column; gap: 12px;
        padding: 16px; border-radius: 12px;
        border: 1px solid var(--dsw-alias-border-l1);
        background: var(--dsw-alias-bg-layer-1);
      }
      .dsh-skins__title { margin: 0; font-size: 14px; font-weight: 600; color: var(--dsw-alias-label-primary); }
      .dsh-skins__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 10px; }
      .dsh-skins__tile {
        position: relative; display: flex; flex-direction: column; gap: 8px;
        padding: 10px; border-radius: 10px; cursor: pointer; text-align: left;
        border: 1px solid var(--dsw-alias-border-l1);
        background: var(--dsw-alias-bg-layer-2);
        color: var(--dsw-alias-label-primary); font: inherit; font-size: 12px;
        transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;
      }
      .dsh-skins__tile:hover { transform: translateY(-1px); border-color: var(--dsw-alias-border-l2); }
      .dsh-skins__tile:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
      .dsh-skins__tile[aria-pressed='true'] {
        border-color: var(--dsw-alias-brand-primary);
        box-shadow: inset 0 0 0 1px var(--dsw-alias-brand-primary);
      }
      .dsh-skins__preview { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; height: 42px; border-radius: 8px; overflow: hidden; }
      .dsh-skins__preview span { display: block; }
      .dsh-skins__row { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
      .dsh-skins__label { font-size: 13px; color: var(--dsw-alias-label-primary); }
      .dsh-skins__hint { font-size: 12px; color: var(--dsw-alias-label-secondary); }
      .dsh-skins__controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; }
      .dsh-skins__btn {
        position: relative; display: inline-flex; align-items: center; justify-content: center;
        height: 28px; padding: 0 10px; border-radius: 8px; font: inherit; font-size: 12px; cursor: pointer;
        border: 1px solid var(--dsw-alias-border-l2);
        background: var(--dsw-alias-bg-layer-2);
        color: var(--dsw-alias-label-primary);
        user-select: none;
        transition: border-color 160ms ease, background-color 160ms ease, opacity 160ms ease;
      }
      .dsh-skins__btn:hover { border-color: var(--dsw-alias-brand-primary); }
      .dsh-skins__btn:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
      .dsh-skins__btn:focus-within { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
      .dsh-skins__btn[disabled], .dsh-skins__btn[data-busy='true'] { opacity: 0.55; cursor: default; }
      .dsh-skins__file {
        position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
        overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; opacity: 0;
      }
      .dsh-skins__input {
        flex: 1 1 190px; min-width: 0; height: 28px; padding: 0 8px; border-radius: 8px;
        border: 1px solid var(--dsw-alias-border-l2);
        background: var(--dsw-alias-bg-layer-2);
        color: var(--dsw-alias-label-primary); font: inherit; font-size: 12px;
      }
      .dsh-skins__input:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
      .dsh-skins__range { width: 132px; accent-color: var(--dsw-alias-brand-primary); }
      .dsh-skins__seg {
        display: inline-flex; border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 8px; overflow: hidden;
      }
      .dsh-skins__seg-btn {
        height: 26px; padding: 0 10px; border: 0; background: transparent;
        color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; cursor: pointer;
        transition: background-color 160ms ease, color 160ms ease;
      }
      .dsh-skins__seg-btn + .dsh-skins__seg-btn { border-left: 1px solid var(--dsw-alias-border-l1); }
      .dsh-skins__seg-btn[aria-pressed='true'] {
        background: var(--dsw-alias-bg-layer-2);
        color: var(--dsw-alias-label-primary);
        font-weight: 500;
      }
      .dsh-skins__seg-btn:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: -2px; }
      .dsh-skins__color {
        width: 44px; height: 26px; padding: 0;
        border: 1px solid var(--dsw-alias-border-l2);
        border-radius: 8px; background: var(--dsw-alias-bg-layer-2); cursor: pointer;
      }
      .dsh-skins__color::-webkit-color-swatch-wrapper { padding: 2px; }
      .dsh-skins__color::-webkit-color-swatch { border: 0; border-radius: 6px; }
      .dsh-skins__color:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
      .dsh-skins__value { font-size: 12px; color: var(--dsw-alias-label-secondary); font-variant-numeric: tabular-nums; min-width: 34px; text-align: right; }
      .dsh-skins__stack { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
      .dsh-skins__sliders { display: flex; flex-direction: column; gap: 8px; flex: 1 1 240px; min-width: 0; }
      .dsh-skins__slider-row { display: flex; align-items: center; gap: 8px; }
      .dsh-skins__slider-row .dsh-skins__label { min-width: 76px; }
      .dsh-skins__thumb {
        width: 84px; height: 48px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l1);
        background-color: var(--dsw-alias-bg-layer-2); background-size: cover; background-position: center;
      }
      .dsh-skins__alert {
        margin: 0; padding: 8px 10px; border-radius: 8px; font-size: 12px;
        border: 1px solid var(--dsw-alias-state-error-primary);
        color: var(--dsw-alias-state-error-primary);
        background: var(--dsw-alias-bg-layer-2);
      }
      .dsh-skins__note { margin: 0; font-size: 12px; color: var(--dsw-alias-label-secondary); }
    `;

    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { en: DICT.en, zh: DICT.zh }), 'skins: dictionaries');
      const t = ctx.locale.bind(NS);

      const store = createStore(loadState());
      let layerOff = null;
      let styleElement = null;
      let persistTimer = null;

      const scheme = () => {
        const snapshot = ctx.theme.getTheme();
        const active = snapshot === null || snapshot === undefined ? null : snapshot.active;
        return active !== null && active !== undefined && active.colorScheme === 'dark' ? 'dark' : 'light';
      };

      /** Which way the glass reads for this state: light labels on dark glass, or the reverse. */
      const directionOf = (state) => resolveDirection(state.shade, state.luminance, scheme());

      /**
       * Backdrop layers — the modal mask and the panel surface sitting on it — get a
       * frosted fill. Detecting the backdrop (a viewport-sized layer that already
       * paints a scrim) turned out to be far more reliable than guessing which
       * element is "the panel": the settings panel can be nearly viewport-sized.
       */
      const BACKDROP_ATTR = 'data-dsh-skins-backdrop';
      let scanTimer = null;
      let lastScanAt = 0;
      /**
       * Markers are sticky: once a layer is frosted it keeps the frost until it leaves
       * the document. A modal reveals itself with an opacity/scale animation, so a
       * fresh match each scan would add and drop the blur frame by frame — the
       * "shimmering between see-through and blurred" this replaced.
       */
      const markedBackdrops = new Set();

      const stripBackdrops = () => {
        for (const element of document.querySelectorAll(`[${BACKDROP_ATTR}]`)) {
          element.removeAttribute(BACKDROP_ATTR);
        }
        markedBackdrops.clear();
      };

      /** Alpha of a computed CSS colour; `1` when it cannot be parsed. */
      const colorAlpha = (color) => {
        const match = /^rgba?\(([^)]+)\)$/i.exec(String(color).trim());
        if (match === null) return 1;
        const parts = match[1].split(',').map((part) => part.trim());
        return parts.length >= 4 ? Number(parts[3]) : 1;
      };

      /**
       * A backdrop: fixed or absolute, covering at least 90% of the viewport in both
       * directions, still taking pointer events, and already painting some scrim of
       * its own. That excludes app shells (transparent), toast regions (no pointer
       * events), and ordinary panels that are smaller than the window.
       */
      const looksLikeBackdrop = (element) => {
        if (!(element instanceof HTMLElement)) return false;
        const style = getComputedStyle(element);
        if (style.position !== 'fixed' && style.position !== 'absolute') return false;
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        if (style.pointerEvents === 'none') return false;
        const rect = element.getBoundingClientRect();
        if (rect.width < window.innerWidth * 0.9 || rect.height < window.innerHeight * 0.9) return false;
        return colorAlpha(style.backgroundColor) > 0.05;
      };

      /** Collect a portal root and two levels below it, where masks and panels sit. */
      const collectCandidates = (root, depth, out) => {
        if (depth > 2) return;
        for (const child of root.children) {
          out.push(child);
          collectCandidates(child, depth + 1, out);
        }
      };

      /**
       * Frost at most the largest backdrop of each portal: two stacked frosting layers
       * would double the veil, and a second layer arriving a frame later reads as a jump.
       */
      const scanBackdrops = () => {
        if (styleElement === null) return;
        if (store.get().wallpaper === null) {
          stripBackdrops();
          return;
        }
        for (const element of [...markedBackdrops]) {
          if (element.isConnected) continue;
          element.removeAttribute(BACKDROP_ATTR);
          markedBackdrops.delete(element);
        }
        for (const root of document.body.children) {
          if (root.id === 'root' || root === styleElement) continue;
          const nodes = [root];
          collectCandidates(root, 1, nodes);
          let best = null;
          let bestArea = 0;
          for (const element of nodes) {
            if (!looksLikeBackdrop(element)) continue;
            const rect = element.getBoundingClientRect();
            const area = rect.width * rect.height;
            if (area <= bestArea) continue;
            bestArea = area;
            best = element;
          }
          if (best === null) continue;
          if (!best.hasAttribute(BACKDROP_ATTR)) best.setAttribute(BACKDROP_ATTR, '');
          markedBackdrops.add(best);
        }
      };

      /**
       * Scans are throttled, but the first one after an idle period runs immediately so
       * a modal that just opened is frosted on its first frame instead of 180ms later.
       */
      const scheduleScan = () => {
        if (scanTimer !== null) return;
        const idle = performance.now() - lastScanAt > 500;
        scanTimer = setTimeout(
          () => {
            scanTimer = null;
            lastScanAt = performance.now();
            scanBackdrops();
          },
          idle ? 0 : 150,
        );
      };

      /**
       * Rewrite the wallpaper stylesheet. The scrim follows the text colour, text
       * over the image gets a matching halo, and every open backdrop layer becomes a
       * frosted surface so Settings cannot blend into the page behind it.
       */
      const paint = (state) => {
        if (styleElement === null) return;
        const wallpaper = state.wallpaper;
        if (wallpaper === null) {
          styleElement.textContent = '';
          stripBackdrops();
          return;
        }
        const direction = directionOf(state);
        const text = resolveTextColors(state, direction);
        const primaryLuminance = hexLuminance(text.primary);
        // The scrim and halo answer to the text colour, the frost to the glass shade.
        const lightText = primaryLuminance === null ? direction === 'lightText' : primaryLuminance > 0.55;
        const glassDark = direction === 'lightText';
        const dim = clamp(state.dim, 0, 0.85);
        const tint = lightText ? '0, 0, 0' : '255, 255, 255';
        const halo = lightText
          ? '0 1px 2px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.22)'
          : '0 1px 2px rgba(255, 255, 255, 0.55), 0 0 10px rgba(255, 255, 255, 0.3)';
        // A veil, not a paint-over: enough fill to calm the page behind a modal,
        // low enough that the app is still recognisable through the blur. The user
        // can dial it down to zero and keep only the blur.
        const veil = clamp(state.veil, 0, 0.9);
        const frost = glassDark ? `rgba(14, 18, 22, ${veil})` : `rgba(250, 250, 251, ${veil})`;
        styleElement.textContent = `
          html, body {
            background-image: linear-gradient(rgba(${tint}, ${dim}), rgba(${tint}, ${dim})), url("${cssUrl(wallpaper.value)}") !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
          }
          body { text-shadow: ${halo}; }
          [${BACKDROP_ATTR}] {
            background-color: ${frost} !important;
            backdrop-filter: blur(22px) saturate(1.06);
            transition: background-color 200ms ease, backdrop-filter 200ms ease;
          }
          [${BACKDROP_ATTR}], [${BACKDROP_ATTR}] * { text-shadow: none; }
        `;
        scheduleScan();
      };

      const applyLayer = (state) => {
        if (layerOff !== null) {
          layerOff();
          layerOff = null;
        }
        const direction = directionOf(state);
        const tokens = buildTokens(
          findSkin(state.skin),
          state.wallpaper !== null,
          state.panel,
          direction,
          resolveTextColors(state, direction),
        );
        if (tokens === null) return;
        layerOff = ctx.theme.overrideTokens('dsh-skins', tokens);
      };

      const applyAll = (state) => {
        applyLayer(state);
        paint(state);
      };

      /**
       * Slider drags repaint the wallpaper immediately but rebuild the token layer
       * only once the drag pauses, so a gesture does not restack the layer per pixel.
       */
      let layerTimer = null;
      const scheduleLayer = () => {
        if (layerTimer !== null) clearTimeout(layerTimer);
        layerTimer = setTimeout(() => {
          layerTimer = null;
          applyLayer(store.get());
        }, 120);
      };

      const persistSoon = (state) => {
        if (persistTimer !== null) clearTimeout(persistTimer);
        persistTimer = setTimeout(() => {
          persistTimer = null;
          saveState(state);
        }, 320);
      };

      /**
       * Commit one change. Wallpaper changes persist immediately so a full storage
       * quota is reported instead of silently lost; slider drags defer the write.
       * Returns whether the change was stored.
       */
      const commit = (patch, options) => {
        const previous = store.get();
        const next = { ...previous, ...patch };
        const defer = options !== undefined && options.deferPersist === true;
        if (!defer && !saveState(next)) {
          store.set({ ...previous, message: 'storageFull' });
          return false;
        }
        store.set(next);
        if (options !== undefined && options.layer === false) {
          paint(next);
          if (options.rebuildLayer === true) scheduleLayer();
        } else {
          applyAll(next);
        }
        if (defer) persistSoon(next);
        return true;
      };

      /** One live object URL for the stored wallpaper; older ones are revoked. */
      let wallpaperUrl = null;

      const releaseWallpaperUrl = () => {
        if (wallpaperUrl !== null) {
          URL.revokeObjectURL(wallpaperUrl);
          wallpaperUrl = null;
        }
      };

      /** Show a stored Blob, then measure it so the glass direction fits the new image. */
      const applyWallpaperBlob = (blob) => {
        releaseWallpaperUrl();
        wallpaperUrl = URL.createObjectURL(blob);
        const url = wallpaperUrl;
        // A different image invalidates the previous brightness reading.
        const next = {
          ...store.get(),
          wallpaper: { kind: 'blob', value: url },
          wallpaperPending: false,
          luminance: null,
        };
        store.set(next);
        applyAll(next);
        saveState(next);
        void measureLuminance(url).then((luminance) => {
          if (luminance === null) return;
          const current = store.get();
          if (current.wallpaper === null || current.wallpaper.value !== url) return;
          commit({ luminance }, { deferPersist: true });
        });
      };

      /**
       * Wallpaper pixels live in IndexedDB, so they arrive after the first paint. Read
       * them once, or migrate a legacy inline data URL out of localStorage first.
       */
      const hydrateWallpaper = async () => {
        const initial = store.get();
        if (initial.wallpaper !== null && initial.wallpaper.kind !== 'data' && !initial.wallpaperPending) return;
        try {
          if (initial.wallpaper !== null && initial.wallpaper.kind === 'data') {
            const response = await fetch(initial.wallpaper.value);
            const blob = await response.blob();
            if (blob.size > 0) {
              await writeWallpaperBlob(blob);
              applyWallpaperBlob(blob);
              return;
            }
            store.set({ ...store.get(), wallpaper: null, message: null });
            saveState(store.get());
            return;
          }
          if (!initial.wallpaperPending) return;
          const blob = await readWallpaperBlob();
          if (blob instanceof Blob && blob.size > 0) {
            applyWallpaperBlob(blob);
            return;
          }
          // The flag promised pixels that are gone; drop it so the UI stops waiting.
          const cleared = { ...store.get(), wallpaper: null, wallpaperPending: false };
          store.set(cleared);
          saveState(cleared);
        } catch (error) {
          store.set({ ...store.get(), message: 'storageUnavailable' });
        }
      };

      // Our own layer rebuilds also emit theme/change, so only an actual light/dark
      // switch may rebuild the layer; every emission still repaints the stylesheet.
      let lastScheme = scheme();
      ctx.effect(
        () =>
          ctx.on('theme/change', () => {
            const next = scheme();
            const switched = next !== lastScheme;
            lastScheme = next;
            paint(store.get());
            if (switched) applyLayer(store.get());
          }),
        'skins: scheme follow',
      );

      /**
       * A wallpaper saved before the text mode existed has no brightness reading.
       * Measure it once at boot so the glass direction follows the image.
       */
      const backfillLuminance = () => {
        const state = store.get();
        if (state.wallpaper === null || state.luminance !== null) return;
        const source = state.wallpaper.value;
        void measureLuminance(source).then((luminance) => {
          if (luminance === null) return;
          const current = store.get();
          if (current.wallpaper === null || current.wallpaper.value !== source) return;
          commit({ luminance }, { deferPersist: true });
        });
      };

      ctx.effect(() => {
        const element = document.createElement('style');
        element.setAttribute('data-dsh-skins', 'wallpaper');
        document.head.appendChild(element);
        styleElement = element;
        applyAll(store.get());
        backfillLuminance();
        void hydrateWallpaper();
        return () => {
          element.remove();
          styleElement = null;
          releaseWallpaperUrl();
          if (persistTimer !== null) {
            clearTimeout(persistTimer);
            persistTimer = null;
          }
          if (layerTimer !== null) {
            clearTimeout(layerTimer);
            layerTimer = null;
          }
          if (layerOff !== null) {
            layerOff();
            layerOff = null;
          }
          if (scanTimer !== null) {
            clearTimeout(scanTimer);
            scanTimer = null;
          }
          stripBackdrops();
        };
      }, 'skins: wallpaper stylesheet');

      /**
       * Backdrop layers open and close as portals appended beside `#root`, so the
       * scan follows document mutations rather than only mount time. Scans are
       * throttled (first one after idle runs at once), and markings are sticky, so a
       * modal's reveal animation cannot add and drop the frost frame by frame.
       */
      ctx.effect(() => {
        if (typeof MutationObserver !== 'function') return undefined;
        const observer = new MutationObserver(() => {
          if (store.get().wallpaper !== null) scheduleScan();
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class', 'hidden', 'aria-hidden'],
        });
        return () => observer.disconnect();
      }, 'skins: overlay observer');

      function SkinIcon(props) {
        const size = typeof props.size === 'number' && props.size > 0 ? props.size : 18;
        return h(
          'svg',
          { viewBox: '0 0 16 16', width: size, height: size, fill: 'none', 'aria-hidden': true, focusable: false },
          h('rect', {
            x: 1.6,
            y: 1.6,
            width: 12.8,
            height: 12.8,
            rx: 3.4,
            stroke: 'currentColor',
            strokeWidth: 1.3,
          }),
          h('circle', { cx: 5.6, cy: 5.6, r: 1.45, fill: 'currentColor' }),
          h('path', {
            d: 'M2.4 11.4l3.3-3.2a1.5 1.5 0 0 1 2.1 0l1.6 1.6 1.4-1.3a1.5 1.5 0 0 1 2 0l1.2 1.1',
            stroke: 'currentColor',
            strokeWidth: 1.3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
          }),
        );
      }

      function skinLabel(skin) {
        if (typeof skin.label === 'string') return t(skin.label);
        const active = ctx.locale.getSnapshot().active;
        return active.startsWith('zh') ? skin.label.zh : skin.label.en;
      }

      function SkinsSection() {
        const [state, setState] = React.useState(() => store.get());
        const [url, setUrl] = React.useState('');
        const [busy, setBusy] = React.useState(false);
        const [, setLocaleRevision] = React.useState(0);
        React.useEffect(() => store.subscribe(setState), []);
        React.useEffect(() => ctx.locale.subscribe(() => setLocaleRevision((value) => value + 1)), []);

        const wallpaper = state.wallpaper;

        const chooseFile = async (event) => {
          const input = event.currentTarget;
          const list = input.files;
          const file = list !== null && list !== undefined && list.length > 0 ? list[0] : null;
          input.value = '';
          if (file === null) return;
          setBusy(true);
          try {
            const prepared = await prepareWallpaper(file);
            await writeWallpaperBlob(prepared.blob);
            releaseWallpaperUrl();
            applyWallpaperBlob(prepared.blob);
            setUrl('');
          } catch (error) {
            const code = error !== null && error !== undefined ? String(error.message ?? '') : '';
            const quota = error !== null && error !== undefined && error.name === 'QuotaExceededError';
            let reason = 'readFailed';
            if (quota || code === 'storageFull') reason = 'storageFull';
            else if (code === 'tooLarge') reason = 'tooLarge';
            else if (code === 'decodeFailed') reason = 'decodeFailed';
            else if (code === 'storageUnavailable') reason = 'storageUnavailable';
            commit({ message: reason });
          } finally {
            setBusy(false);
          }
        };

        const applyUrl = () => {
          const value = url.trim();
          if (value === '') return;
          const looksLikePath =
            /^[a-zA-Z]:[\\/]/.test(value) || /^\\\\/.test(value) || /^file:/i.test(value) || /^\/(?!\/)/.test(value);
          if (looksLikePath) {
            commit({ message: 'localPath' });
            return;
          }
          if (!isImageSource(value)) {
            commit({ message: 'invalidUrl' });
            return;
          }
          // A remote URL replaces any stored blob, so release both the object URL and
          // the IndexedDB record before committing the new source.
          releaseWallpaperUrl();
          void deleteWallpaperBlob().catch(() => {});
          // Remote images without CORS cannot be measured; the auto mode then follows
          // the appearance scheme until a measurable image arrives.
          if (commit({ wallpaper: { kind: 'url', value }, wallpaperPending: false, luminance: null, message: null })) {
            setUrl('');
            void measureLuminance(value).then((luminance) => {
              const current = store.get();
              if (luminance === null) return;
              if (current.wallpaper === null || current.wallpaper.value !== value) return;
              commit({ luminance }, { deferPersist: true });
            });
          }
        };

        return h(
          React.Fragment,
          null,
          h('style', { key: 'style' }, STYLE),
          h(
            'div',
            { key: 'page', className: 'dsh-skins' },
            h('p', { key: 'lead', className: 'dsh-skins__lead' }, t('lead')),
            h(
              'section',
              { key: 'palettes', className: 'dsh-skins__card' },
              h('h3', { key: 'title', className: 'dsh-skins__title' }, t('palettes')),
              h(
                'div',
                { key: 'grid', className: 'dsh-skins__grid' },
                SKINS.map((entry) => {
                  const selected = entry.id === findSkin(state.skin).id;
                  const lightPalette = entry.light;
                  const darkPalette = entry.dark;
                  return h(
                    'button',
                    {
                      key: entry.id,
                      type: 'button',
                      className: 'dsh-skins__tile',
                      'aria-pressed': selected,
                      onClick: () => commit({ skin: entry.id, message: null }),
                    },
                    h(
                      'span',
                      { key: 'preview', className: 'dsh-skins__preview', 'aria-hidden': true },
                      h('span', {
                        style: { background: lightPalette === null ? 'var(--dsw-alias-bg-layer-2)' : lightPalette.base },
                      }),
                      h('span', {
                        style: { background: lightPalette === null ? 'var(--dsw-alias-border-l1)' : lightPalette.brand },
                      }),
                      h('span', {
                        style: { background: darkPalette === null ? 'var(--dsw-alias-bg-base)' : darkPalette.base },
                      }),
                      h('span', {
                        style: {
                          background: darkPalette === null ? 'var(--dsw-alias-brand-primary)' : darkPalette.brand,
                        },
                      }),
                    ),
                    h('span', { key: 'label' }, skinLabel(entry)),
                    selected ? h('span', { key: 'mark', className: 'dsh-skins__hint' }, t('selected')) : null,
                  );
                }),
              ),
            ),
            h(
              'section',
              { key: 'wallpaper', className: 'dsh-skins__card' },
              h('h3', { key: 'title', className: 'dsh-skins__title' }, t('wallpaper')),
              h('p', { key: 'hint', className: 'dsh-skins__hint' }, t('wallpaperHint')),
              h(
                'div',
                { key: 'actions', className: 'dsh-skins__controls' },
                h(
                  'label',
                  { key: 'choose', className: 'dsh-skins__btn', 'data-busy': busy ? 'true' : 'false' },
                  busy ? t('processing') : t('choose'),
                  h('input', {
                    type: 'file',
                    accept: 'image/*',
                    className: 'dsh-skins__file',
                    onChange: chooseFile,
                  }),
                ),
                h('input', {
                  key: 'url',
                  type: 'text',
                  className: 'dsh-skins__input',
                  placeholder: t('urlPlaceholder'),
                  value: url,
                  onChange: (event) => setUrl(event.target.value),
                  onKeyDown: (event) => {
                    if (event.key === 'Enter') applyUrl();
                  },
                }),
                h(
                  'button',
                  {
                    key: 'apply',
                    type: 'button',
                    className: 'dsh-skins__btn',
                    disabled: busy || url.trim() === '',
                    onClick: applyUrl,
                  },
                  t('applyUrl'),
                ),
                wallpaper !== null
                  ? h(
                      'button',
                      {
                        key: 'remove',
                        type: 'button',
                        className: 'dsh-skins__btn',
                        onClick: () => {
                          releaseWallpaperUrl();
                          void deleteWallpaperBlob().catch(() => {});
                          commit({ wallpaper: null, wallpaperPending: false, luminance: null, message: null });
                        },
                      },
                      t('remove'),
                    )
                  : null,
              ),
              wallpaper !== null
                ? h(
                    'div',
                    { key: 'current', className: 'dsh-skins__stack' },
                    h('span', {
                      className: 'dsh-skins__thumb',
                      style: { backgroundImage: `url("${cssUrl(wallpaper.value)}")` },
                      title: t('preview'),
                    }),
                    h(
                      'div',
                      { key: 'sliders', className: 'dsh-skins__sliders' },
                      h(
                        'div',
                        { key: 'dim', className: 'dsh-skins__slider-row' },
                        h('span', { className: 'dsh-skins__label' }, t('dim')),
                        h('input', {
                          type: 'range',
                          className: 'dsh-skins__range',
                          min: 0,
                          max: 85,
                          step: 1,
                          value: Math.round(state.dim * 100),
                          'aria-label': t('dim'),
                          onChange: (event) =>
                            commit(
                              { dim: clamp(Number(event.target.value) / 100, 0, 0.85) },
                              { deferPersist: true, layer: false },
                            ),
                        }),
                        h('span', { className: 'dsh-skins__value' }, Math.round(state.dim * 100) + '%'),
                      ),
                      h(
                        'div',
                        { key: 'panel', className: 'dsh-skins__slider-row' },
                        h('span', { className: 'dsh-skins__label' }, t('panel')),
                        h('input', {
                          type: 'range',
                          className: 'dsh-skins__range',
                          min: 0,
                          max: 95,
                          step: 1,
                          value: Math.round(state.panel * 100),
                          'aria-label': t('panel'),
                          onChange: (event) =>
                            commit(
                              { panel: clamp(Number(event.target.value) / 100, 0, MAX_PANEL) },
                              { deferPersist: true, layer: false, rebuildLayer: true },
                            ),
                        }),
                        h('span', { className: 'dsh-skins__value' }, Math.round(state.panel * 100) + '%'),
                      ),
                      h(
                        'div',
                        { key: 'veil', className: 'dsh-skins__slider-row' },
                        h('span', { className: 'dsh-skins__label' }, t('veil')),
                        h('input', {
                          type: 'range',
                          className: 'dsh-skins__range',
                          min: 0,
                          max: 90,
                          step: 1,
                          value: Math.round(state.veil * 100),
                          'aria-label': t('veil'),
                          onChange: (event) =>
                            commit(
                              { veil: clamp(Number(event.target.value) / 100, 0, 0.9) },
                              { deferPersist: true, layer: false },
                            ),
                        }),
                        h('span', { className: 'dsh-skins__value' }, Math.round(state.veil * 100) + '%'),
                      ),
                      h(
                        'div',
                        { key: 'shade', className: 'dsh-skins__slider-row' },
                        h('span', { className: 'dsh-skins__label' }, t('panelShade')),
                        h(
                          'div',
                          { className: 'dsh-skins__seg', role: 'group', 'aria-label': t('panelShade') },
                          [
                            ['auto', 'auto'],
                            ['dark', 'darkGlass'],
                            ['light', 'lightGlass'],
                          ].map(([value, label]) =>
                            h(
                              'button',
                              {
                                key: value,
                                type: 'button',
                                className: 'dsh-skins__seg-btn',
                                'aria-pressed': state.shade === value,
                                onClick: () => commit({ shade: value }),
                              },
                              t(label),
                            ),
                          ),
                        ),
                      ),
                      h(
                        'div',
                        { key: 'textTheme', className: 'dsh-skins__slider-row' },
                        h('span', { className: 'dsh-skins__label' }, t('textTheme')),
                        h(
                          'div',
                          { className: 'dsh-skins__seg', role: 'group', 'aria-label': t('textTheme') },
                          [
                            ['auto', 'auto'],
                            ['contrast', 'contrast'],
                            ['soft', 'soft'],
                            ['custom', 'custom'],
                          ].map(([value, label]) =>
                            h(
                              'button',
                              {
                                key: value,
                                type: 'button',
                                className: 'dsh-skins__seg-btn',
                                'aria-pressed': state.textTheme === value,
                                onClick: () => commit({ textTheme: value }),
                              },
                              t(label),
                            ),
                          ),
                        ),
                      ),
                      state.textTheme === 'custom'
                        ? h(
                            'div',
                            { key: 'custom-colors', className: 'dsh-skins__slider-row' },
                            h('span', { className: 'dsh-skins__label' }, t('primaryText')),
                            h('input', {
                              type: 'color',
                              className: 'dsh-skins__color',
                              'aria-label': t('primaryText'),
                              value: resolveTextColors(state, directionOf(state)).primary,
                              onChange: (event) =>
                                commit(
                                  { textPrimary: event.target.value },
                                  { deferPersist: true, layer: false, rebuildLayer: true },
                                ),
                            }),
                            h('span', { className: 'dsh-skins__label' }, t('mutedText')),
                            h('input', {
                              type: 'color',
                              className: 'dsh-skins__color',
                              'aria-label': t('mutedText'),
                              value: resolveTextColors(state, directionOf(state)).muted,
                              onChange: (event) =>
                                commit(
                                  { textMuted: event.target.value },
                                  { deferPersist: true, layer: false, rebuildLayer: true },
                                ),
                            }),
                          )
                        : null,
                    ),
                  )
                : null,
              state.message !== null
                ? h('p', { key: 'alert', className: 'dsh-skins__alert', role: 'alert' }, t(state.message))
                : null,
            ),
            h('p', { key: 'note', className: 'dsh-skins__note' }, t('note')),
          ),
        );
      }

      ctx.slots.inject('settings.section', () =>
        ctx.slots.register(
          { name: 'settings.section', id: 'skins', order: 5, label: () => t('section') },
          SkinsSection,
        ),
      );

      ctx.slots.inject('settings.section.icon', () =>
        ctx.slots.register({ name: 'settings.section.icon', id: 'skins' }, SkinIcon),
      );
    }

    return {
      inject: ['slots', 'locale', 'theme'],
      apply,
    };
  },
});
