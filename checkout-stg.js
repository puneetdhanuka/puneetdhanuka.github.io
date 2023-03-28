/**
 * Local Storage Slim Minified JS
 * Skipped minification because the original files appears to be already minified.
 * Original file: /npm/localstorage-slim@2.3.0/dist/localstorage-slim.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
! function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.ls = e() : t.ls = e()
}(this, (function() {
    return (() => {
        "use strict";
        var t = {
                d: (e, r) => {
                    for (var n in r) t.o(r, n) && !t.o(e, n) && Object.defineProperty(e, n, {
                        enumerable: !0,
                        get: r[n]
                    })
                },
                o: (t, e) => Object.prototype.hasOwnProperty.call(t, e)
            },
            e = {};
        t.d(e, {
            default: () => p
        });
        const r = (...t) => {},
            n = t => null !== t && "Object" === t.constructor.name;
        let c;
        const o = () => {
                if (void 0 !== c) return c;
                c = !0;
                try {
                    localStorage || (c = !1)
                } catch (t) {
                    c = !1
                }
                return i(), c
            },
            l = String.fromCharCode(0),
            a = (t, e, r = !0) => r ? [...JSON.stringify(t)].map((t => String.fromCharCode(t.charCodeAt(0) + e))).join("") : JSON.parse([...t].map((t => String.fromCharCode(t.charCodeAt(0) - e))).join("")),
            s = {
                ttl: null,
                encrypt: !1,
                encrypter: a,
                decrypter: (t, e) => a(t, e, !1),
                secret: 75
            },
            i = (t = !1) => {
                if (!o()) return !1;
                Object.keys(localStorage).forEach((e => {
                    const r = localStorage.getItem(e);
                    if (!r) return;
                    let c;
                    try {
                        c = JSON.parse(r)
                    } catch (t) {
                        return
                    }
                    n(c) && l in c && (Date.now() > c.ttl || t) && localStorage.removeItem(e)
                }))
            },
            p = {
                config: s,
                set: (t, e, n = {}) => {
                    if (!o()) return !1;
                    const c = Object.assign(Object.assign(Object.assign({}, s), n), {
                        encrypt: !1 !== n.encrypt && (n.encrypt || s.encrypt),
                        ttl: null === n.ttl ? null : n.ttl || s.ttl
                    });
                    try {
                        const n = c.ttl && !isNaN(c.ttl) && c.ttl > 0;
                        let o = n ? {
                            [l]: e,
                            ttl: Date.now() + 1e3 * c.ttl
                        } : e;
                        c.encrypt && (n ? o[l] = (c.encrypter || r)(o[l], c.secret) : o = (c.encrypter || r)(o, c.secret)), localStorage.setItem(t, JSON.stringify(o))
                    } catch (t) {
                        return !1
                    }
                },
                get: (t, e = {}) => {
                    if (!o()) return null;
                    const c = localStorage.getItem(t);
                    if (!c) return null;
                    const a = Object.assign(Object.assign(Object.assign({}, s), e), {
                        encrypt: !1 !== e.encrypt && (e.encrypt || s.encrypt),
                        ttl: null === e.ttl ? null : e.ttl || s.ttl
                    });
                    let i = JSON.parse(c);
                    const p = n(i) && l in i;
                    if (a.decrypt || a.encrypt) try {
                        p ? i[l] = (a.decrypter || r)(i[l], a.secret) : i = (a.decrypter || r)(i, a.secret)
                    } catch (t) {}
                    return p ? Date.now() > i.ttl ? (localStorage.removeItem(t), null) : i[l] : i
                },
                flush: i,
                clear: () => {
                    if (!o()) return !1;
                    localStorage.clear()
                },
                remove: t => {
                    if (!o()) return !1;
                    localStorage.removeItem(t)
                }
            };
        return e.default
    })()
}));
//# sourceMappingURL=localstorage-slim.js.map
const device_meta_cache_key = 'ppecDeviceMeta';
class PPEC_Device_Meta {
    constructor() {
        this.network = navigator?.connection?.effectiveType ?? null;
        this.paymentRequestSupported = !(window?.PaymentRequest == undefined);
        this.canMakePayment = false;
        this.hasEnrolledInstrument = false;
        this.userOperatingSystem = navigator?.userAgent?.split(';')[1]?.trim() ?? null;
        this.elapsedTime = -1;
        this.eligibility = false;
        this.created_at = Date.now();
        this.updated_at = Date.now();
    }
    set_has_enrolled_instrument(has_enrolled_instrument) {
        this.hasEnrolledInstrument = has_enrolled_instrument;
        this.eligibility = has_enrolled_instrument;
        this.updated_at = Date.now();
    }
    get_has_enrolled_instrument() {
        return this.hasEnrolledInstrument;
    }
    set_can_make_payment(can_make_payment) {
        this.canMakePayment = can_make_payment;
        this.updated_at = Date.now();
    }
    get_can_make_payment() {
        return this.canMakePayment;
    }
    set_elapsed_time(elapsed_time) {
        this.elapsedTime = elapsed_time;
        this.updated_at = Date.now();
    }
    set_eligibility(eligibility) {
        this.eligibility = eligibility;
        this.updated_at = Date.now();
    }
    get_payment_request_supported() {
        return this.paymentRequestSupported;
    }
}
class PPEC_Process_Tracker {
    constructor() {
        this.reset();
    }
    start_tracking() {
        this.start_time = performance?.now() ?? 0;
    }
    end_tracking() {
        this.end_time = performance?.now() ?? 0;
    }
    get_elapsed_time() {
        return this.end_time - this.start_time;
    }
    reset() {
        this.start_time = 0;
        this.end_time = 0;
    }
}
function ppec_create_payment_request(payment_request_data, payable_amount) {
    console.log('ppec_create_payment_request called at ' + Date.now());
    return new PaymentRequest([{
        supportedMethods: ["https://mercury-stg.phonepe.com/transact/checkout"],
        data: payment_request_data
    }], {
        total: {
            label: 'Cart Amount',
            amount: {
                currency: 'INR',
                value: payable_amount
            }
        }
    });
}
function ppec_save_device_meta_to_cache_with_ttl(device_meta, ttl) {
    ls.set(device_meta_cache_key, JSON.stringify(device_meta), {
        ttl: ttl
    });
}
function ppec_is_device_meta_cache_valid() {
    if (ls.get(device_meta_cache_key) == null) return false;
    return true;
}
function ppec_is_eligibility_cache_true() {
    console.log('get eligibility from cache' + JSON.parse(ls.get(device_meta_cache_key))?.eligibility);
    return JSON.parse(ls.get(device_meta_cache_key))?.eligibility;
}
async function ppec_get_device_meta(payment_request_context) {
    try{
        console.log('starting detection');
        var device_meta = new PPEC_Device_Meta();
        var process_tracker = new PPEC_Process_Tracker();
        var payment_request_data = {
            url: "ppe://v2expressbuy",
            constraints: payment_request_context?.constraints ?? []
        };
        console.log('the payment_request_data is = ' + JSON.stringify(payment_request_data));
        if (device_meta.get_payment_request_supported() == false) return device_meta;
        var can_make_payment = await ppec_create_payment_request(payment_request_data, 1).canMakePayment();
        device_meta.set_can_make_payment(can_make_payment);
        console.log('can make payment value = ' + device_meta.get_can_make_payment());
        if (device_meta.get_can_make_payment() == false) return device_meta;
        process_tracker.start_tracking();
        const has_enrolled_instrument_values = await Promise.all([
            ppec_create_payment_request(payment_request_data, 1).hasEnrolledInstrument(),
            ppec_create_payment_request(payment_request_data, 1).hasEnrolledInstrument(),
            ppec_create_payment_request(payment_request_data, 1).hasEnrolledInstrument(),
            ppec_create_payment_request(payment_request_data, 1).hasEnrolledInstrument(),
            ppec_create_payment_request(payment_request_data, 1).hasEnrolledInstrument()
        ]);
        process_tracker.end_tracking();
        device_meta.set_elapsed_time(process_tracker.get_elapsed_time());
        console.log('has enrolled instrument values = ' +  JSON.stringify(has_enrolled_instrument_values));
        has_enrolled_instrument_values.forEach(has_enrolled_instrument => {
            if (device_meta.get_has_enrolled_instrument() == false) {
                device_meta.set_has_enrolled_instrument(has_enrolled_instrument);
                device_meta.set_eligibility(has_enrolled_instrument);
            }
        });
        console.log('device meta = ' + JSON.stringify(device_meta));
        return device_meta;
    }catch(err){
        console.log(err);
        return device_meta;
    }
}
async function ppec_check_app_and_cache_device_meta(payment_request_context) {
    if (ppec_is_device_meta_cache_valid() && ppec_is_eligibility_cache_true()) return;
    var device_meta = await ppec_get_device_meta(payment_request_context);
    console.log('detection finished');
    console.log('device meta after detection finished' + JSON.stringify(device_meta));
    ppec_save_device_meta_to_cache_with_ttl(device_meta, 30 * 30);
}
