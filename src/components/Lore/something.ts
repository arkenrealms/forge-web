// @ts-nocheck
/* eslint-disable */

export default function ($: any) {
  // @ts-ignore
  !(function (t) {
    var e = (t.scrollTo = function (e, r, n) {
      t(window).scrollTo(e, r, n);
    });
    function r(t) {
      return 'object' == typeof t ? t : { top: t, left: t };
    }
    (e.defaults = { axis: 'xy', duration: parseFloat(t.fn.jquery) >= 1.3 ? 0 : 1 }),
      (e.window = function (e) {
        return t(window)._scrollable();
      }),
      (t.fn._scrollable = function () {
        return this.map(function () {
          var e = this;
          if (!(!e.nodeName || -1 != t.inArray(e.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body'])))
            return e;
          var r = (e.contentWindow || e).document || e.ownerDocument || e;
          return t.browser.safari || 'BackCompat' == r.compatMode ? r.body : r.documentElement;
        });
      }),
      (t.fn.scrollTo = function (n, a, i) {
        return (
          'object' == typeof a && ((i = a), (a = 0)),
          'function' == typeof i && (i = { onAfter: i }),
          'max' == n && (n = 9e9),
          (i = t.extend({}, e.defaults, i)),
          (a = a || i.speed || i.duration),
          (i.queue = i.queue && i.axis.length > 1),
          i.queue && (a /= 2),
          (i.offset = r(i.offset)),
          (i.over = r(i.over)),
          this._scrollable()
            .each(function () {
              var s,
                o = this,
                c = t(o),
                u = n,
                l = {},
                d = c.is('html,body');
              switch (typeof u) {
                case 'number':
                case 'string':
                  if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(u)) {
                    u = r(u);
                    break;
                  }
                  u = t(u, this);
                case 'object':
                  (u.is || u.style) && (s = (u = t(u)).offset());
              }
              function h(t) {
                c.animate(
                  l,
                  a,
                  i.easing,
                  t &&
                    function () {
                      t.call(this, n, i);
                    }
                );
              }
              t.each(i.axis.split(''), function (t, r) {
                var n = 'x' == r ? 'Left' : 'Top',
                  a = n.toLowerCase(),
                  f = 'scroll' + n,
                  p = o[f],
                  m = e.max(o, r);
                if (s)
                  (l[f] = s[a] + (d ? 0 : p - c.offset()[a])),
                    i.margin &&
                      ((l[f] -= parseInt(u.css('margin' + n)) || 0),
                      (l[f] -= parseInt(u.css('border' + n + 'Width')) || 0)),
                    (l[f] += i.offset[a] || 0),
                    i.over[a] && (l[f] += u['x' == r ? 'width' : 'height']() * i.over[a]);
                else {
                  var v = u[a];
                  l[f] = v && v.slice && '%' == v.slice(-1) ? (parseFloat(v) / 100) * m : v;
                }
                /^\d+$/.test(l[f]) && (l[f] = l[f] <= 0 ? 0 : Math.min(l[f], m)),
                  !t && i.queue && (p != l[f] && h(i.onAfterFirst), delete l[f]);
              }),
                h(i.onAfter);
            })
            .end()
        );
      }),
      (e.max = function (e, r) {
        var n = 'x' == r ? 'Width' : 'Height',
          a = 'scroll' + n;
        if (!t(e).is('html,body')) return e[a] - t(e)[n.toLowerCase()]();
        var i = 'client' + n,
          s = e.ownerDocument.documentElement,
          o = e.ownerDocument.body;
        return Math.max(s[a], o[a]) - Math.min(s[i], o[i]);
      });
  })($),
    (function (t) {
      (t.address = (function () {
        var e,
          r,
          n,
          a = function (e) {
            t(t.address).trigger(
              t.extend(
                t.Event(e),
                function () {
                  for (var e = {}, r = t.address.parameterNames(), n = 0, a = r.length; n < a; n++)
                    e[r[n]] = t.address.parameter(r[n]);
                  return {
                    value: t.address.value(),
                    path: t.address.path(),
                    pathNames: t.address.pathNames(),
                    parameterNames: r,
                    parameters: e,
                    queryString: t.address.queryString(),
                  };
                }.call(t.address)
              )
            );
          },
          s = function (e, r, n) {
            return t().bind.apply(t(t.address), Array.prototype.slice.call(arguments)), t.address;
          },
          o = function () {
            return U.pushState && A.state !== e;
          },
          c = function () {
            return ('/' + W.pathname.replace(new RegExp(A.state), '') + W.search + (u() ? '#' + u() : '')).replace(
              D,
              '/'
            );
          },
          u = function () {
            var t = W.href.indexOf('#');
            return -1 != t ? h(W.href.substr(t + 1), T) : '';
          },
          l = function () {
            return o() ? c() : u();
          },
          d = function (t) {
            return (t = t.toString()), (A.strict && '/' != t.substr(0, 1) ? '/' : '') + t;
          },
          h = function (t, e) {
            return A.crawlable && e ? ('' !== t ? '!' : '') + t : t.replace(/^\!/, '');
          },
          f = function (t, e) {
            return parseInt(t.css(e), 10);
          },
          p = function (t) {
            for (var e, r, n = 0, a = t.childNodes.length; n < a; n++) {
              try {
                'src' in t.childNodes[n] && t.childNodes[n].src && (e = String(t.childNodes[n].src));
              } catch (t) {}
              (r = p(t.childNodes[n])) && (e = r);
            }
            return e;
          },
          m = function () {
            if (!G) {
              var t = l();
              Z != t && (L && _ < 7 ? W.reload() : (L && _ < 8 && A.history && B(y, 50), (Z = t), v(T)));
            }
          },
          v = function (t) {
            a(S), a(t ? j : q), B(g, 10);
          },
          g = function () {
            if ('null' !== A.tracker && null !== A.tracker) {
              var r = t.isFunction(A.tracker) ? A.tracker : R[A.tracker],
                n = (W.pathname + W.search + (t.address && !o() ? t.address.value() : ''))
                  .replace(/\/\//, '/')
                  .replace(/^\/$/, '');
              t.isFunction(r)
                ? r(n)
                : t.isFunction(R.urchinTracker)
                  ? R.urchinTracker(n)
                  : R.pageTracker !== e && t.isFunction(R.pageTracker._trackPageview)
                    ? R.pageTracker._trackPageview(n)
                    : R._gaq !== e && t.isFunction(R._gaq.push) && R._gaq.push(['_trackPageview', decodeURI(n)]);
            }
          },
          y = function () {
            var t =
              'javascript:' +
              T +
              ";document.open();document.writeln('<html><head><title>" +
              M.title.replace("'", "\\'") +
              '</title><script>var ' +
              E +
              ' = "' +
              encodeURIComponent(l()) +
              (M.domain != W.hostname ? '";document.domain="' + M.domain : '') +
              '";</script></head></html>\');document.close();';
            _ < 7 ? (n.src = t) : n.contentWindow.location.replace(t);
          },
          w = function () {
            if (P && -1 != Q) {
              var t,
                e = P.substr(Q + 1).split('&');
              for (i = 0; i < e.length; i++)
                (t = e[i].split('=')),
                  /^(autoUpdate|crawlable|history|strict|wrap)$/.test(t[0]) &&
                    (A[t[0]] = isNaN(t[1]) ? /^(true|yes)$/i.test(t[1]) : 0 !== parseInt(t[1], 10)),
                  /^(state|tracker)$/.test(t[0]) && (A[t[0]] = t[1]);
              P = null;
            }
            Z = l();
          },
          b = function () {
            if (!J) {
              (J = $), w();
              var r = function () {
                  x.call(this), k.call(this);
                },
                i = t('body').ajaxComplete(r);
              if ((r(), A.wrap)) {
                t('body > *')
                  .wrapAll(
                    '<div style="padding:' +
                      (f(i, 'marginTop') + f(i, 'paddingTop')) +
                      'px ' +
                      (f(i, 'marginRight') + f(i, 'paddingRight')) +
                      'px ' +
                      (f(i, 'marginBottom') + f(i, 'paddingBottom')) +
                      'px ' +
                      (f(i, 'marginLeft') + f(i, 'paddingLeft')) +
                      'px;" />'
                  )
                  .parent()
                  .wrap(
                    '<div id="' +
                      E +
                      '" style="height:100%;overflow:auto;position:relative;' +
                      (F && !window.statusbar.visible ? 'resize:both;' : '') +
                      '" />'
                  );
                t('html, body').css({ height: '100%', margin: 0, padding: 0, overflow: 'hidden' }),
                  F &&
                    t('<style type="text/css" />')
                      .appendTo('head')
                      .text('#' + E + '::-webkit-resizer { background-color: #fff; }');
              }
              if (L && _ < 8) {
                var s = M.getElementsByTagName('frameset')[0];
                (n = M.createElement((s ? '' : 'i') + 'frame')),
                  s
                    ? (s.insertAdjacentElement('beforeEnd', n),
                      (s[s.cols ? 'cols' : 'rows'] += ',0'),
                      (n.noResize = $),
                      (n.frameBorder = n.frameSpacing = 0))
                    : ((n.style.display = 'none'),
                      (n.style.width = n.style.height = 0),
                      (n.tabIndex = -1),
                      M.body.insertAdjacentElement('afterBegin', n)),
                  B(function () {
                    t(n).bind('load', function () {
                      var t = n.contentWindow;
                      (Z = t[E] !== e ? t[E] : '') != l() && (v(T), (W.hash = h(Z, $)));
                    }),
                      n.contentWindow[E] === e && y();
                  }, 50);
              }
              B(function () {
                a('init'), v(T);
              }, 1),
                o() ||
                  ((L && _ > 7) || (!L && 'on' + N in R)
                    ? R.addEventListener
                      ? R.addEventListener(N, m, T)
                      : R.attachEvent && R.attachEvent('on' + N, m)
                    : z(m, 50));
            }
          },
          x = function () {
            var e,
              r = t('a'),
              n = r.size(),
              a = -1,
              i = function () {
                ++a != n && ((e = t(r.get(a))).is('[rel*="address:"]') && e.address(), B(i, 1));
              };
            B(i, 1);
          },
          k = function () {
            if (A.crawlable) {
              var e = W.pathname.replace(/\/$/, ''),
                r = '_escaped_fragment_';
              -1 != t('body').html().indexOf(r) &&
                t('a[href]:not([href^=http]), a[href*="' + document.domain + '"]').each(function () {
                  var n = t(this)
                    .attr('href')
                    .replace(/^http:/, '')
                    .replace(new RegExp(e + '/?$'), '');
                  ('' !== n && -1 == n.indexOf(r)) ||
                    t(this).attr('href', '#' + n.replace(new RegExp('/(.*)\\?' + r + '=(.*)$'), '!$2'));
                });
            }
          },
          E = 'jQueryAddress',
          N = 'hashchange',
          S = 'change',
          j = 'internalChange',
          q = 'externalChange',
          $ = !0,
          T = !1,
          A = { autoUpdate: $, crawlable: T, history: $, strict: $, wrap: T },
          O = t.browser,
          _ = 111,
          I = false,
          L = false,
          C = false,
          F = true,
          R = (function () {
            try {
              return top.document !== e ? top : window;
            } catch (t) {
              return window;
            }
          })(),
          M = R.document,
          U = R.history,
          W = R.location,
          z = setInterval,
          B = setTimeout,
          D = /\/{2,9}/g,
          K = navigator.userAgent,
          P = p(document),
          Q = P ? P.indexOf('?') : -1,
          H = M.title,
          G = T,
          J = T,
          V = $,
          X = $,
          Y = T,
          Z = l();
        if (L) {
          (_ = parseFloat(K.substr(K.indexOf('MSIE') + 4))),
            M.documentMode && M.documentMode != _ && (_ = 8 != M.documentMode ? 7 : 8);
          var tt = M.onpropertychange;
          M.onpropertychange = function () {
            tt && tt.call(M), M.title != H && -1 != M.title.indexOf('#' + l()) && (M.title = H);
          };
        }
        if ((r = (I && _ >= 1) || (L && _ >= 6) || (C && _ >= 9.5) || (F && _ >= 523))) {
          if ((C && (history.navigationMode = 'compatible'), 'complete' == document.readyState))
            var et = setInterval(function () {
              t.address && (b(), clearInterval(et));
            }, 50);
          else w(), t(b);
          t(window)
            .bind('popstate', function () {
              Z != l() && ((Z = l()), v(T));
            })
            .bind('unload', function () {
              R.removeEventListener ? R.removeEventListener(N, m, T) : R.detachEvent && R.detachEvent('on' + N, m);
            });
        } else r || '' === u() ? g() : W.replace(W.href.substr(0, W.href.indexOf('#')));
        return {
          bind: function (t, e, r) {
            return s(t, e, r);
          },
          init: function (t) {
            return s('init', t);
          },
          change: function (t) {
            return s(S, t);
          },
          internalChange: function (t) {
            return s(j, t);
          },
          externalChange: function (t) {
            return s(q, t);
          },
          baseURL: function () {
            var t = W.href;
            return (
              -1 != t.indexOf('#') && (t = t.substr(0, t.indexOf('#'))),
              /\/$/.test(t) && (t = t.substr(0, t.length - 1)),
              t
            );
          },
          autoUpdate: function (t) {
            return t !== e ? ((A.autoUpdate = t), this) : A.autoUpdate;
          },
          crawlable: function (t) {
            return t !== e ? ((A.crawlable = t), this) : A.crawlable;
          },
          history: function (t) {
            return t !== e ? ((A.history = t), this) : A.history;
          },
          state: function (t) {
            if (t !== e) {
              A.state = t;
              var r = c();
              return (
                A.state !== e &&
                  (U.pushState
                    ? '/#/' == r.substr(0, 3) && W.replace(A.state.replace(/^\/$/, '') + r.substr(2))
                    : '/' != r &&
                      r.replace(/^\/#/, '') != u() &&
                      B(function () {
                        W.replace(A.state.replace(/^\/$/, '') + '/#' + r);
                      }, 1)),
                this
              );
            }
            return A.state;
          },
          strict: function (t) {
            return t !== e ? ((A.strict = t), this) : A.strict;
          },
          tracker: function (t) {
            return t !== e ? ((A.tracker = t), this) : A.tracker;
          },
          wrap: function (t) {
            return t !== e ? ((A.wrap = t), this) : A.wrap;
          },
          update: function () {
            return (Y = $), this.value(Z), (Y = T), this;
          },
          title: function (t) {
            return t !== e
              ? (B(function () {
                  (H = M.title = t),
                    X &&
                      n &&
                      n.contentWindow &&
                      n.contentWindow.document &&
                      ((n.contentWindow.document.title = t), (X = T)),
                    !V && I && W.replace(-1 != W.href.indexOf('#') ? W.href : W.href + '#'),
                    (V = T);
                }, 50),
                this)
              : M.title;
          },
          value: function (t) {
            if (t !== e) {
              if (('/' == (t = d(t)) && (t = ''), Z == t && !Y)) return;
              return (
                (V = $),
                (Z = t),
                (A.autoUpdate || Y) &&
                  (v($),
                  o()
                    ? U[A.history ? 'pushState' : 'replaceState'](
                        {},
                        '',
                        A.state.replace(/\/$/, '') + ('' === Z ? '/' : Z)
                      )
                    : ((G = $),
                      (F || Z != l()) && (A.history ? (W.hash = '#' + h(Z, $)) : W.replace('#' + h(Z, $))),
                      L && _ < 8 && A.history && B(y, 50),
                      F
                        ? B(function () {
                            G = T;
                          }, 1)
                        : (G = T))),
                this
              );
            }
            return r ? d(Z) : null;
          },
          path: function (t) {
            if (t !== e) {
              var r = this.queryString(),
                n = this.hash();
              return this.value(t + (r ? '?' + r : '') + (n ? '#' + n : '')), this;
            }
            return d(Z).split('#')[0].split('?')[0];
          },
          pathNames: function () {
            var t = this.path(),
              e = t.replace(D, '/').split('/');
            return (
              ('/' != t.substr(0, 1) && 0 !== t.length) || e.splice(0, 1),
              '/' == t.substr(t.length - 1, 1) && e.splice(e.length - 1, 1),
              e
            );
          },
          queryString: function (t) {
            if (t !== e) {
              var r = this.hash();
              return this.value(this.path() + (t ? '?' + t : '') + (r ? '#' + r : '')), this;
            }
            var n = Z.split('?');
            return n.slice(1, n.length).join('?').split('#')[0];
          },
          parameter: function (r, n, a) {
            var i, s;
            if (n !== e) {
              var o = this.parameterNames();
              for (s = [], n = n ? n.toString() : '', i = 0; i < o.length; i++) {
                var c = o[i],
                  u = this.parameter(c);
                'string' == typeof u && (u = [u]),
                  c == r && (u = null === n || '' === n ? [] : a ? u.concat([n]) : [n]);
                for (var l = 0; l < u.length; l++) s.push(c + '=' + u[l]);
              }
              return (
                -1 == t.inArray(r, o) && null !== n && '' !== n && s.push(r + '=' + n),
                this.queryString(s.join('&')),
                this
              );
            }
            if ((n = this.queryString())) {
              var d = [];
              for (s = n.split('&'), i = 0; i < s.length; i++) {
                var h = s[i].split('=');
                h[0] == r && d.push(h.slice(1).join('='));
              }
              if (0 !== d.length) return 1 != d.length ? d : d[0];
            }
          },
          parameterNames: function () {
            var e = this.queryString(),
              r = [];
            if (e && -1 != e.indexOf('='))
              for (var n = e.split('&'), a = 0; a < n.length; a++) {
                var i = n[a].split('=')[0];
                -1 == t.inArray(i, r) && r.push(i);
              }
            return r;
          },
          hash: function (t) {
            if (t !== e) return this.value(Z.split('#')[0] + (t ? '#' + t : '')), this;
            var r = Z.split('#');
            return r.slice(1, r.length).join('#');
          },
        };
      })()),
        (t.fn.address = function (e) {
          if (!t(this).attr('address')) {
            var r = function (r) {
              if (r.shiftKey || r.ctrlKey || r.metaKey) return !0;
              if (t(this).is('a')) {
                var n = e
                  ? e.call(this)
                  : /address:/.test(t(this).attr('rel'))
                    ? t(this).attr('rel').split('address:')[1].split(' ')[0]
                    : void 0 !== t.address.state() && '/' != t.address.state()
                      ? t(this)
                          .attr('href')
                          .replace(new RegExp('^(.*' + t.address.state() + '|\\.)'), '')
                      : t(this)
                          .attr('href')
                          .replace(/^(#\!?|\.)/, '');
                t.address.value(n), r.preventDefault();
              }
            };
            t(this)
              .click(r)
              .live('click', r)
              .live('submit', function (r) {
                if (t(this).is('form')) {
                  var n = t(this).attr('action'),
                    a = e ? e.call(this) : (-1 != n.indexOf('?') ? n.replace(/&$/, '') : n + '?') + t(this).serialize();
                  t.address.value(a), r.preventDefault();
                }
              })
              .attr('address', !0);
          }
          return this;
        });
    })($);
}
