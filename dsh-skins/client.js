window.__ModuleLoader__.load({
  id: '@local/dsh-skins',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'skins';
    const STORE_KEY = 'dsh-skins:state:v1';
    /** Longest edge a chosen file is downscaled to before it is stored. */
    const MAX_SIDE = 1920;
    /** A data URL above this many characters cannot fit in the localStorage quota. */
    const MAX_IMAGE_CHARS = 1800000;

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
        textMode: 'Text contrast',
        auto: 'Auto',
        lightText: 'Light text',
        darkText: 'Dark text',
        preview: 'Preview',
        note: 'Settings are stored in this browser only; images are downscaled before they are saved.',
        storageFull: 'That image is too large to store locally. Downscale it or paste a URL instead.',
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
        textMode: '文字对比度',
        auto: '自动',
        lightText: '浅字',
        darkText: '深字',
        preview: '预览',
        note: '设置仅保存在本机浏览器；图片保存前会自动压缩。',
        storageFull: '图片太大，无法保存在本地。请先压缩，或改用图片链接。',
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
    /** Floors keep dense text areas readable even at maximum transparency. */
    const SURFACE_FLOORS = { layer1: 0.36, layer2: 0.42, overlay: 0.65, sidebar: 0.36 };

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
     * becomes transparent, surfaces become glass, and labels follow `direction`, so a
     * dark wall gets light text (and dark glass) whatever the light/dark appearance is.
     */
    function buildTokens(skin, wallpaper, panel, direction) {
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
      const transparency = clamp(panel, 0, 0.85);
      const tokens = {
        [TOKEN.base]: { light: 'transparent', dark: 'transparent' },
        // Both scheme slots carry the same value: the text answers to the wallpaper.
        [TOKEN.text]: { light: glass.text, dark: glass.text },
        [TOKEN.muted]: { light: glass.muted, dark: glass.muted },
        [TOKEN.border1]: { light: glass.border1, dark: glass.border1 },
        [TOKEN.border2]: { light: glass.border2, dark: glass.border2 },
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
     * one. An explicit choice wins; otherwise the measured brightness decides, and
     * an unmeasurable image falls back to the appearance scheme.
     */
    function resolveDirection(text, luminance, scheme) {
      if (text === 'light') return 'lightText';
      if (text === 'dark') return 'darkText';
      if (typeof luminance === 'number' && Number.isFinite(luminance)) {
        return luminance < 0.5 ? 'lightText' : 'darkText';
      }
      return scheme === 'dark' ? 'lightText' : 'darkText';
    }

    /** Downscale a chosen file in the browser, then keep it as a JPEG data URL. */
    function shrinkImage(file, maxSide, quality) {
      const limit = typeof maxSide === 'number' && maxSide > 0 ? maxSide : MAX_SIDE;
      const encode = typeof quality === 'number' && quality > 0 ? quality : 0.85;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('readFailed'));
        reader.onload = () => {
          const image = new Image();
          image.onerror = () => reject(new Error('decodeFailed'));
          image.onload = () => {
            try {
              const scale = Math.min(1, limit / Math.max(image.width, image.height));
              const width = Math.max(1, Math.round(image.width * scale));
              const height = Math.max(1, Math.round(image.height * scale));
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const context = canvas.getContext('2d');
              if (context === null) throw new Error('decodeFailed');
              context.drawImage(image, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', encode));
            } catch (error) {
              reject(new Error('decodeFailed'));
            }
          };
          image.src = String(reader.result);
        };
        reader.readAsDataURL(file);
      });
    }

    function defaultState() {
      return { skin: 'default', wallpaper: null, dim: 0.18, panel: 0.35, text: 'auto', luminance: null, message: null };
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
        const wallpaper =
          parsed.wallpaper !== null &&
          typeof parsed.wallpaper === 'object' &&
          typeof parsed.wallpaper.value === 'string' &&
          isImageSource(parsed.wallpaper.value)
            ? { kind: parsed.wallpaper.kind === 'url' ? 'url' : 'data', value: parsed.wallpaper.value }
            : null;
        const legacy = parsed.panel === undefined;
        const storedDim = parsed.dim === undefined ? 0.18 : clamp(parsed.dim, 0, 0.85);
        const text = parsed.text === 'light' || parsed.text === 'dark' ? parsed.text : 'auto';
        const luminance =
          typeof parsed.luminance === 'number' && Number.isFinite(parsed.luminance)
            ? Math.min(1, Math.max(0, parsed.luminance))
            : null;
        return {
          skin,
          wallpaper,
          // A wallpaper saved before the panel slider existed was veiled by the old
          // defaults; start it lighter so the image reads, and let the slider raise it.
          dim: legacy ? Math.min(storedDim, 0.18) : storedDim,
          panel: legacy ? 0.35 : clamp(parsed.panel, 0, 0.85),
          text,
          luminance,
          message: null,
        };
      } catch (error) {
        return defaultState();
      }
    }

    function saveState(state) {
      try {
        window.localStorage.setItem(
          STORE_KEY,
          JSON.stringify({
            skin: state.skin,
            wallpaper: state.wallpaper,
            dim: state.dim,
            panel: state.panel,
            text: state.text,
            luminance: state.luminance,
          }),
        );
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
      const directionOf = (state) => resolveDirection(state.text, state.luminance, scheme());

      /**
       * Rewrite the wallpaper stylesheet. The scrim follows the glass direction, and
       * text over the image gets a matching halo so labels survive busy photos.
       */
      const paint = (state) => {
        if (styleElement === null) return;
        const wallpaper = state.wallpaper;
        if (wallpaper === null) {
          styleElement.textContent = '';
          return;
        }
        const lightText = directionOf(state) === 'lightText';
        const dim = clamp(state.dim, 0, 0.85);
        const tint = lightText ? '0, 0, 0' : '255, 255, 255';
        const halo = lightText
          ? '0 1px 2px rgba(0, 0, 0, 0.5), 0 0 10px rgba(0, 0, 0, 0.22)'
          : '0 1px 2px rgba(255, 255, 255, 0.55), 0 0 10px rgba(255, 255, 255, 0.3)';
        styleElement.textContent = `
          html, body {
            background-image: linear-gradient(rgba(${tint}, ${dim}), rgba(${tint}, ${dim})), url("${cssUrl(wallpaper.value)}") !important;
            background-size: cover !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            background-attachment: fixed !important;
          }
          body { text-shadow: ${halo}; }
        `;
      };

      const applyLayer = (state) => {
        if (layerOff !== null) {
          layerOff();
          layerOff = null;
        }
        const tokens = buildTokens(
          findSkin(state.skin),
          state.wallpaper !== null,
          state.panel,
          directionOf(state),
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
        return () => {
          element.remove();
          styleElement = null;
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
        };
      }, 'skins: wallpaper stylesheet');

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
            let dataUrl = await shrinkImage(file);
            if (dataUrl.length > MAX_IMAGE_CHARS) dataUrl = await shrinkImage(file, 1280, 0.72);
            if (dataUrl.length > MAX_IMAGE_CHARS) {
              commit({ message: 'storageFull' });
              return;
            }
            const luminance = await measureLuminance(dataUrl);
            if (commit({ wallpaper: { kind: 'data', value: dataUrl }, luminance, message: null })) {
              setUrl('');
              return;
            }
            // The browser refused the first write; retry the whole image at a smaller encode.
            const compact = await shrinkImage(file, 1100, 0.65);
            const compactLuminance = compact.length > MAX_IMAGE_CHARS ? null : await measureLuminance(compact);
            if (
              compact.length > MAX_IMAGE_CHARS ||
              !commit({ wallpaper: { kind: 'data', value: compact }, luminance: compactLuminance, message: null })
            ) {
              commit({ message: 'storageFull' });
            }
          } catch (error) {
            const reason =
              error !== null && error !== undefined && error.message === 'decodeFailed' ? 'decodeFailed' : 'readFailed';
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
          // Remote images without CORS cannot be measured; the auto mode then follows
          // the appearance scheme until a measurable image arrives.
          if (commit({ wallpaper: { kind: 'url', value }, luminance: null, message: null })) {
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
                        onClick: () => commit({ wallpaper: null, message: null }),
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
                          max: 85,
                          step: 1,
                          value: Math.round(state.panel * 100),
                          'aria-label': t('panel'),
                          onChange: (event) =>
                            commit(
                              { panel: clamp(Number(event.target.value) / 100, 0, 0.85) },
                              { deferPersist: true, layer: false, rebuildLayer: true },
                            ),
                        }),
                        h('span', { className: 'dsh-skins__value' }, Math.round(state.panel * 100) + '%'),
                      ),
                      h(
                        'div',
                        { key: 'text', className: 'dsh-skins__slider-row' },
                        h('span', { className: 'dsh-skins__label' }, t('textMode')),
                        h(
                          'div',
                          { className: 'dsh-skins__seg', role: 'group', 'aria-label': t('textMode') },
                          [
                            ['auto', 'auto'],
                            ['light', 'lightText'],
                            ['dark', 'darkText'],
                          ].map(([value, label]) =>
                            h(
                              'button',
                              {
                                key: value,
                                type: 'button',
                                className: 'dsh-skins__seg-btn',
                                'aria-pressed': state.text === value,
                                onClick: () => commit({ text: value }),
                              },
                              t(label),
                            ),
                          ),
                        ),
                      ),
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
