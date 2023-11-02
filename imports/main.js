(()=>{
    "use strict";
    var i, o, t, r, s;
    function n(i, o) {
        return i.startsWith(o.scriptSrcHost)
    }
    function e(i, o) {
        return !("use-credentials" !== o.scriptCrossorigin || !n(i, o)) || !(!o.isCrossSiteMashupOnWindows || !n(i, o)) && "anonymous" !== o.scriptCrossorigin
    }
    function a(i, o) {
        return new Promise(((t,r)=>{
            const s = window.document.createElement("script");
            s.src = i,
            o.isCrossSiteMashupOnWindows ? o.scriptCrossorigin && (s.crossOrigin = n(i, o) ? o.scriptCrossorigin : "anonymous") : s.crossOrigin = "anonymous",
            s.addEventListener("error", (()=>{
                r(new Error(`Error loading ${i}`))
            }
            )),
            s.addEventListener("load", (()=>{
                t()
            }
            )),
            window.document.head.appendChild(s)
        }
        ))
    }
    function c(i, o, t) {
        const r = window.document.createElement(i);
        Object.keys(o).forEach((i=>r.setAttribute(i, o[i]))),
        t && (r.innerText = t),
        window.document.head.appendChild(r)
    }
    function d(i) {
        return window.location.host.endsWith(".qlikcloud.com") ? null : window.localStorage.getItem("devtools") && window.localStorage.getItem(`import-map-override:${i}`)
    }
    function u(i, o) {
        let t, r;
        if ("string" == typeof i ? (t = d(i) || o.imports[i],
        r = i) : (t = d(i.main) || o.imports[i.main],
        r = i.main,
        t && i.sub && (t += i.sub)),
        !t)
            throw new Error(`Unable to resolve bare specifier '${r}' from ${window.location.host}`);
        return t
    }
    function l(i) {
        try {
            const o = new URL(i);
            return `${o.protocol}//${o.host}`
        } catch (o) {
            return i
        }
    }
    function w(i) {
        const o = {
            isWindows: !1,
            scriptSrcHost: l(g),
            scriptCrossorigin: S
        };
        var t;
        return h && (o.isMashup = !0,
        (null === (t = window.requirejs) || void 0 === t ? void 0 : t.toUrl("").startsWith(window.location.origin)) || (o.isCrossSite = !0)),
        i || (o.hasLocalResources = !0),
        o.isCrossSiteMashupOnWindows = o.isCrossSite && o.isWindows && o.isMashup,
        o
    }
    const m = (null === (i = window.document.currentScript) || void 0 === i ? void 0 : i.getAttribute("data-cdn-base-url")) || 'https://cdn.qlikcloud.com'
      , p = "string" == typeof m ? m : "";
    var f;
    const h = (null !== (f = null === (t = window.document.currentScript) || void 0 === t || null === (o = t.getAttribute("src")) || void 0 === o ? void 0 : o.indexOf("assets/external/requirejs/require.js")) && void 0 !== f ? f : -1) >= 0
      , S = (null === (r = window.document.currentScript) || void 0 === r ? void 0 : r.getAttribute("crossorigin")) || null
      , g = (null === (s = window.document.currentScript) || void 0 === s ? void 0 : s.getAttribute("src")) || "";
    async function v() {
        return window.___qlik_main__bootstrap = window.___qlik_main__bootstrap || async function(i) {
            const o = w(p)
              , t = await async function(i, o) {
                let t = `${i}/qmfe/import-map.json`;
                if (o.isWindows && o.isMashup) {
                    if (!window.requirejs)
                        throw new Error("requirejs could not be found on window");
                    t = window.requirejs.toUrl("qmfe/import-map.json")
                }
                if (o.hasLocalResources && o.isMashup) {
                    if (!window.requirejs)
                        throw new Error("requirejs could not be found on window");
                    t = window.requirejs.toUrl("qmfe/import-map.json").replace("/resources", "")
                }
                const r = {};
                e(t, o) && (r.credentials = "include");
                const s = await fetch(t, r)
                  , n = await s.json();
                if (o.isMashup && (o.isWindows || o.hasLocalResources)) {
                    var a;
                    if (!(null === (a = window.requirejs) || void 0 === a ? void 0 : a.toUrl))
                        throw new Error("requirejs could not be found on window");
                    for (const i in n.imports) {
                        if (o.isWindows) {
                            const o = n.imports[i].replace(/^(\.\.)?\/resources\//, "");
                            n.imports[i] = window.requirejs.toUrl(o)
                        }
                        if (o.hasLocalResources) {
                            const o = new URL(window.requirejs.toUrl(""));
                            o.pathname = n.imports[i],
                            n.imports[i] = o.toString()
                        }
                    }
                }
                return function(i) {
                    var o;
                    const t = "qmfeimportmapoverride="
                      , r = null === (o = document.cookie.split("; ").find((i=>i.startsWith(t)))) || void 0 === o ? void 0 : o.substring(22);
                    if (r) {
                        const o = /"([^"]+)"="([^"]+)"/g
                          , t = r.match(o);
                        if (t)
                            for (const o of t) {
                                const [,t,r] = o.match(/"([^"]+)"="([^"]+)"/) || [];
                                t && r && (i.imports[t] = r)
                            }
                    }
                }(n),
                n
            }(i, o);
            c("meta", {
                name: "import-map-overrides-domains",
                content: "denylist:qlikcloud.com"
            }),
            c("meta", {
                name: "importmap-type",
                content: "systemjs-importmap"
            }),
            c("link", {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css?family=Source+Sans+Pro:100,200,300,400,500,600,700,800,900"
            }),
            c("script", {
                type: "systemjs-importmap"
            }, JSON.stringify(t)),
            await Promise.all([{
                main: "@qlik-trial/systemjs/",
                sub: "dist/system.min.js"
            }, {
                main: "@qlik-trial/systemjs/",
                sub: "dist/extras/amd.min.js"
            }, "import-map-overrides"].map((i=>u(i, t))).map((i=>a(i, o))));
            const r = {
                DEFAULT_RESOLVE: ".js"
            };
            if (System.config(r),
            o.isCrossSiteMashupOnWindows && (r.ACCESS_CONTROL_HOST_WITH_CREDENTIALS = o.scriptSrcHost,
            r.ACCESS_CONTROL_CROSS_ORIGIN = o.scriptCrossorigin,
            System.config(r),
            o.isCrossSite)) {
                const i = u({
                    main: "@qlik-trial/systemjs/",
                    sub: "dist/extras/script-load-with-credentials.min.js"
                }, t);
                await a(i, o)
            }
            return t.public || {}
        }(p),
        await window.___qlik_main__bootstrap
    }
    window.QlikMain = window.QlikMain || {
        bootstrap: v,
        import: async i=>{
            const o = function(i, o) {
                return 0 === i.indexOf("private:") ? i.substring(8) : (t = i,
                (window.location.host.endsWith(".qlikcloud.com") ? null : window.localStorage.getItem("devtools") && window.localStorage.getItem(`public-map-override:${t}`)) || o[i] || i);
                var t
            }(i, await v());
            if (o)
                return System.import(o);
            throw new Error(`No such public module id: ${i}`)
        }
        ,
        resourceNeedsCredentials: i=>e(i, w(p))
    }
}
)();
