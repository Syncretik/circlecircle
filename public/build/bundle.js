(function (l, r) {
  if (!l || l.getElementById("livereloadscript")) return;
  r = l.createElement("script");
  r.async = 1;
  r.src =
    "//" +
    (self.location.host || "localhost").split(":")[0] +
    ":35729/livereload.js?snipver=1";
  r.id = "livereloadscript";
  l.getElementsByTagName("head")[0].appendChild(r);
})(self.document);
var app = (function () {
  "use strict";

  function noop() {}
  function assign(tar, src) {
    // @ts-ignore
    for (const k in src) tar[k] = src[k];
    return tar;
  }
  function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
      loc: { file, line, column, char },
    };
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a
      ? b == b
      : a !== b || (a && typeof a === "object") || typeof a === "function";
  }
  let src_url_equal_anchor;
  function src_url_equal(element_src, url) {
    if (!src_url_equal_anchor) {
      src_url_equal_anchor = document.createElement("a");
    }
    src_url_equal_anchor.href = url;
    return element_src === src_url_equal_anchor.href;
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
      ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
      : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === undefined) {
        return lets;
      }
      if (typeof lets === "object") {
        const merged = [];
        const len = Math.max($$scope.dirty.length, lets.length);
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(
    slot,
    slot_definition,
    ctx,
    $$scope,
    slot_changes,
    get_slot_context_fn,
  ) {
    if (slot_changes) {
      const slot_context = get_slot_context(
        slot_definition,
        ctx,
        $$scope,
        get_slot_context_fn,
      );
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy)
      ? action_result.destroy
      : noop;
  }

  const globals =
    typeof window !== "undefined"
      ? window
      : typeof globalThis !== "undefined"
      ? globalThis
      : global;
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
      if (iterations[i]) iterations[i].d(detaching);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function svg_element(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function empty() {
    return text("");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null) node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element) {
    return Array.from(element.childNodes);
  }
  function set_style(node, key, value, important) {
    if (value == null) {
      node.style.removeProperty(key);
    } else {
      node.style.setProperty(key, value, important ? "important" : "");
    }
  }
  function toggle_class(element, name, toggle) {
    element.classList[toggle ? "add" : "remove"](name);
  }
  function custom_event(
    type,
    detail,
    { bubbles = false, cancelable = false } = {},
  ) {
    const e = document.createEvent("CustomEvent");
    e.initCustomEvent(type, bubbles, cancelable, detail);
    return e;
  }

  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  /**
   * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
   * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
   * it can be called from an external module).
   *
   * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
   *
   * https://svelte.dev/docs#run-time-svelte-onmount
   */
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  /**
   * Schedules a callback to run immediately before the component is unmounted.
   *
   * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
   * only one that runs inside a server-side component.
   *
   * https://svelte.dev/docs#run-time-svelte-ondestroy
   */
  function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
  }
  /**
   * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
   * Event dispatchers are functions that can take two arguments: `name` and `detail`.
   *
   * Component events created with `createEventDispatcher` create a
   * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
   * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
   * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
   * property and can contain any type of data.
   *
   * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
   */
  function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail, { cancelable = false } = {}) => {
      const callbacks = component.$$.callbacks[type];
      if (callbacks) {
        // TODO are there situations where events could be dispatched
        // in a server (non-DOM) environment?
        const event = custom_event(type, detail, { cancelable });
        callbacks.slice().forEach((fn) => {
          fn.call(component, event);
        });
        return !event.defaultPrevented;
      }
      return true;
    };
  }
  // TODO figure out if we still want to support
  // shorthand events, or if we want to implement
  // a real bubbling mechanism
  function bubble(component, event) {
    const callbacks = component.$$.callbacks[event.type];
    if (callbacks) {
      // @ts-ignore
      callbacks.slice().forEach((fn) => fn.call(this, event));
    }
  }

  const dirty_components = [];
  const binding_callbacks = [];
  let render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = /* @__PURE__ */ Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function tick() {
    schedule_update();
    return resolved_promise;
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  // flush() calls callbacks in this order:
  // 1. All beforeUpdate callbacks, in order: parents before children
  // 2. All bind:this callbacks, in reverse order: children before parents.
  // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
  //    for afterUpdates called during the initial onMount, which are called in
  //    reverse order: children before parents.
  // Since callbacks might update component values, which could trigger another
  // call to flush(), the following steps guard against this:
  // 1. During beforeUpdate, any updated components will be added to the
  //    dirty_components array and will cause a reentrant call to flush(). Because
  //    the flush index is kept outside the function, the reentrant call will pick
  //    up where the earlier call left off and go through all dirty components. The
  //    current_component value is saved and restored so that the reentrant call will
  //    not interfere with the "parent" flush() call.
  // 2. bind:this callbacks cannot trigger new flush() calls.
  // 3. During afterUpdate, any updated components will NOT have their afterUpdate
  //    callback called a second time; the seen_callbacks set, outside the flush()
  //    function, guarantees this behavior.
  const seen_callbacks = new Set();
  let flushidx = 0; // Do *not* move this inside the flush() function
  function flush() {
    // Do not reenter flush while dirty components are updated, as this can
    // result in an infinite loop. Instead, let the inner flush handle it.
    // Reentrancy is ok afterwards for bindings etc.
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      // first, call beforeUpdate functions
      // and update components
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e) {
        // reset dirty state to not end up in a deadlocked state and then rethrow
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length) binding_callbacks.pop()();
      // then, once components are updated, call
      // afterUpdate functions. This may cause
      // subsequent updates...
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          // ...so guard against infinite loops
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  /**
   * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
   */
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) =>
      fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c),
    );
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }
  const outroing = new Set();
  let outros;
  function group_outros() {
    outros = {
      r: 0,
      c: [],
      p: outros, // parent group
    };
  }
  function check_outros() {
    if (!outros.r) {
      run_all(outros.c);
    }
    outros = outros.p;
  }
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach, callback) {
    if (block && block.o) {
      if (outroing.has(block)) return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach) block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  function outro_and_destroy_block(block, lookup) {
    transition_out(block, 1, 1, () => {
      lookup.delete(block.key);
    });
  }
  function update_keyed_each(
    old_blocks,
    dirty,
    get_key,
    dynamic,
    ctx,
    list,
    lookup,
    node,
    destroy,
    create_each_block,
    next,
    get_context,
  ) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--) old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    const updates = [];
    i = n;
    while (i--) {
      const child_ctx = get_context(ctx, list, i);
      const key = get_key(child_ctx);
      let block = lookup.get(key);
      if (!block) {
        block = create_each_block(key, child_ctx);
        block.c();
      } else if (dynamic) {
        // defer updates until all the DOM shuffling is done
        updates.push(() => block.p(child_ctx, dirty));
      }
      new_lookup.set(key, (new_blocks[i] = block));
      if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
      transition_in(block, 1);
      block.m(node, next);
      lookup.set(block.key, block);
      next = block.first;
      n--;
    }
    while (o && n) {
      const new_block = new_blocks[n - 1];
      const old_block = old_blocks[o - 1];
      const new_key = new_block.key;
      const old_key = old_block.key;
      if (new_block === old_block) {
        // do nothing
        next = new_block.first;
        o--;
        n--;
      } else if (!new_lookup.has(old_key)) {
        // remove old block
        destroy(old_block, lookup);
        o--;
      } else if (!lookup.has(new_key) || will_move.has(new_key)) {
        insert(new_block);
      } else if (did_move.has(old_key)) {
        o--;
      } else if (deltas.get(new_key) > deltas.get(old_key)) {
        did_move.add(new_key);
        insert(new_block);
      } else {
        will_move.add(old_key);
        o--;
      }
    }
    while (o--) {
      const old_block = old_blocks[o];
      if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
    }
    while (n) insert(new_blocks[n - 1]);
    run_all(updates);
    return new_blocks;
  }
  function validate_each_keys(ctx, list, get_context, get_key) {
    const keys = new Set();
    for (let i = 0; i < list.length; i++) {
      const key = get_key(get_context(ctx, list, i));
      if (keys.has(key)) {
        throw new Error("Cannot have duplicate keys in a keyed each");
      }
      keys.add(key);
    }
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      // onMount happens before the initial afterUpdate
      add_render_callback(() => {
        const new_on_destroy = component.$$.on_mount
          .map(run)
          .filter(is_function);
        // if the component was destroyed immediately
        // it will update the `$$.on_destroy` reference to `null`.
        // the destructured on_destroy may still reference to the old array
        if (component.$$.on_destroy) {
          component.$$.on_destroy.push(...new_on_destroy);
        } else {
          // Edge case - component was destroyed immediately,
          // most likely as a result of a binding initialising
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      // TODO null out other refs, including component.$$ (but need to
      // preserve final state?)
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
  }
  function init(
    component,
    options,
    instance,
    create_fragment,
    not_equal,
    props,
    append_styles,
    dirty = [-1],
  ) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = (component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(
        options.context ||
          (parent_component ? parent_component.$$.context : []),
      ),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root,
    });
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
      ? instance(component, options.props || {}, (i, ret, ...rest) => {
          const value = rest.length ? rest[0] : ret;
          if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
            if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
            if (ready) make_dirty(component, i);
          }
          return ret;
        })
      : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        $$.fragment && $$.fragment.c();
      }
      if (options.intro) transition_in(component.$$.fragment);
      mount_component(
        component,
        options.target,
        options.anchor,
        options.customElement,
      );
      flush();
    }
    set_current_component(parent_component);
  }
  /**
   * Base class for Svelte components. Used when dev=false.
   */
  class SvelteComponent {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks =
        this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1) callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  }

  function dispatch_dev(type, detail) {
    document.dispatchEvent(
      custom_event(type, Object.assign({ version: "3.59.2" }, detail), {
        bubbles: true,
      }),
    );
  }
  function append_dev(target, node) {
    dispatch_dev("SvelteDOMInsert", { target, node });
    append(target, node);
  }
  function insert_dev(target, node, anchor) {
    dispatch_dev("SvelteDOMInsert", { target, node, anchor });
    insert(target, node, anchor);
  }
  function detach_dev(node) {
    dispatch_dev("SvelteDOMRemove", { node });
    detach(node);
  }
  function listen_dev(
    node,
    event,
    handler,
    options,
    has_prevent_default,
    has_stop_propagation,
    has_stop_immediate_propagation,
  ) {
    const modifiers =
      options === true
        ? ["capture"]
        : options
        ? Array.from(Object.keys(options))
        : [];
    if (has_prevent_default) modifiers.push("preventDefault");
    if (has_stop_propagation) modifiers.push("stopPropagation");
    if (has_stop_immediate_propagation)
      modifiers.push("stopImmediatePropagation");
    dispatch_dev("SvelteDOMAddEventListener", {
      node,
      event,
      handler,
      modifiers,
    });
    const dispose = listen(node, event, handler, options);
    return () => {
      dispatch_dev("SvelteDOMRemoveEventListener", {
        node,
        event,
        handler,
        modifiers,
      });
      dispose();
    };
  }
  function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
      dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
    else dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
  }
  function validate_each_argument(arg) {
    if (
      typeof arg !== "string" &&
      !(arg && typeof arg === "object" && "length" in arg)
    ) {
      let msg = "{#each} only iterates over array-like objects.";
      if (typeof Symbol === "function" && arg && Symbol.iterator in arg) {
        msg += " You can use a spread to convert this iterable into an array.";
      }
      throw new Error(msg);
    }
  }
  function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
      if (!~keys.indexOf(slot_key)) {
        console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
      }
    }
  }
  /**
   * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
   */
  class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
      if (!options || (!options.target && !options.$$inline)) {
        throw new Error("'target' is a required option");
      }
      super();
    }
    $destroy() {
      super.$destroy();
      this.$destroy = () => {
        console.warn("Component was already destroyed"); // eslint-disable-line no-console
      };
    }
    $capture_state() {}
    $inject_state() {}
  }

  /* node_modules/svelte-carousel/src/components/Dot/Dot.svelte generated by Svelte v3.59.2 */

  const file$d = "node_modules/svelte-carousel/src/components/Dot/Dot.svelte";

  function create_fragment$d(ctx) {
    let button;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        button = element("button");
        attr_dev(
          button,
          "class",
          "sc-carousel-button sc-carousel-dot__dot svelte-yu7247",
        );
        toggle_class(button, "sc-carousel-dot__dot_active", /*active*/ ctx[0]);
        add_location(button, file$d, 7, 0, 99);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, button, anchor);

        if (!mounted) {
          dispose = listen_dev(
            button,
            "click",
            /*click_handler*/ ctx[1],
            false,
            false,
            false,
            false,
          );
          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*active*/ 1) {
          toggle_class(
            button,
            "sc-carousel-dot__dot_active",
            /*active*/ ctx[0],
          );
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(button);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$d.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$d($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Dot", slots, []);
    let { active = false } = $$props;
    const writable_props = ["active"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Dot> was created with unknown prop '${key}'`);
    });

    function click_handler(event) {
      bubble.call(this, $$self, event);
    }

    $$self.$$set = ($$props) => {
      if ("active" in $$props) $$invalidate(0, (active = $$props.active));
    };

    $$self.$capture_state = () => ({ active });

    $$self.$inject_state = ($$props) => {
      if ("active" in $$props) $$invalidate(0, (active = $$props.active));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [active, click_handler];
  }

  class Dot extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$d, create_fragment$d, safe_not_equal, {
        active: 0,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Dot",
        options,
        id: create_fragment$d.name,
      });
    }

    get active() {
      throw new Error(
        "<Dot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set active(value) {
      throw new Error(
        "<Dot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }
  }

  /* node_modules/svelte-carousel/src/components/Dots/Dots.svelte generated by Svelte v3.59.2 */
  const file$c = "node_modules/svelte-carousel/src/components/Dots/Dots.svelte";

  function get_each_context$1(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[5] = list[i];
    child_ctx[7] = i;
    return child_ctx;
  }

  // (23:2) {#each Array(pagesCount) as _, pageIndex (pageIndex)}
  function create_each_block$1(key_1, ctx) {
    let div;
    let dot;
    let t;
    let current;

    function click_handler() {
      return /*click_handler*/ ctx[3](/*pageIndex*/ ctx[7]);
    }

    dot = new Dot({
      props: {
        active: /*currentPageIndex*/ ctx[1] === /*pageIndex*/ ctx[7],
      },
      $$inline: true,
    });

    dot.$on("click", click_handler);

    const block = {
      key: key_1,
      first: null,
      c: function create() {
        div = element("div");
        create_component(dot.$$.fragment);
        t = space();
        attr_dev(
          div,
          "class",
          "sc-carousel-dots__dot-container svelte-1oj5bge",
        );
        add_location(div, file$c, 23, 4, 515);
        this.first = div;
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        mount_component(dot, div, null);
        append_dev(div, t);
        current = true;
      },
      p: function update(new_ctx, dirty) {
        ctx = new_ctx;
        const dot_changes = {};
        if (dirty & /*currentPageIndex, pagesCount*/ 3)
          dot_changes.active =
            /*currentPageIndex*/ ctx[1] === /*pageIndex*/ ctx[7];
        dot.$set(dot_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(dot.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(dot.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_component(dot);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block$1.name,
      type: "each",
      source: "(23:2) {#each Array(pagesCount) as _, pageIndex (pageIndex)}",
      ctx,
    });

    return block;
  }

  function create_fragment$c(ctx) {
    let div;
    let each_blocks = [];
    let each_1_lookup = new Map();
    let current;
    let each_value = Array(/*pagesCount*/ ctx[0]);
    validate_each_argument(each_value);
    const get_key = (ctx) => /*pageIndex*/ ctx[7];
    validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    for (let i = 0; i < each_value.length; i += 1) {
      let child_ctx = get_each_context$1(ctx, each_value, i);
      let key = get_key(child_ctx);
      each_1_lookup.set(
        key,
        (each_blocks[i] = create_each_block$1(key, child_ctx)),
      );
    }

    const block = {
      c: function create() {
        div = element("div");

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        attr_dev(div, "class", "sc-carousel-dots__container svelte-1oj5bge");
        add_location(div, file$c, 21, 0, 411);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);

        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(div, null);
          }
        }

        current = true;
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*currentPageIndex, Array, pagesCount, handleDotClick*/ 7) {
          each_value = Array(/*pagesCount*/ ctx[0]);
          validate_each_argument(each_value);
          group_outros();
          validate_each_keys(ctx, each_value, get_each_context$1, get_key);
          each_blocks = update_keyed_each(
            each_blocks,
            dirty,
            get_key,
            1,
            ctx,
            each_value,
            each_1_lookup,
            div,
            outro_and_destroy_block,
            create_each_block$1,
            null,
            get_each_context$1,
          );
          check_outros();
        }
      },
      i: function intro(local) {
        if (current) return;

        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }

        current = true;
      },
      o: function outro(local) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }

        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);

        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].d();
        }
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$c.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$c($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Dots", slots, []);
    const dispatch = createEventDispatcher();
    let { pagesCount = 1 } = $$props;
    let { currentPageIndex = 0 } = $$props;

    function handleDotClick(pageIndex) {
      dispatch("pageChange", pageIndex);
    }

    const writable_props = ["pagesCount", "currentPageIndex"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Dots> was created with unknown prop '${key}'`);
    });

    const click_handler = (pageIndex) => handleDotClick(pageIndex);

    $$self.$$set = ($$props) => {
      if ("pagesCount" in $$props)
        $$invalidate(0, (pagesCount = $$props.pagesCount));
      if ("currentPageIndex" in $$props)
        $$invalidate(1, (currentPageIndex = $$props.currentPageIndex));
    };

    $$self.$capture_state = () => ({
      createEventDispatcher,
      Dot,
      dispatch,
      pagesCount,
      currentPageIndex,
      handleDotClick,
    });

    $$self.$inject_state = ($$props) => {
      if ("pagesCount" in $$props)
        $$invalidate(0, (pagesCount = $$props.pagesCount));
      if ("currentPageIndex" in $$props)
        $$invalidate(1, (currentPageIndex = $$props.currentPageIndex));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [pagesCount, currentPageIndex, handleDotClick, click_handler];
  }

  class Dots extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$c, create_fragment$c, safe_not_equal, {
        pagesCount: 0,
        currentPageIndex: 1,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Dots",
        options,
        id: create_fragment$c.name,
      });
    }

    get pagesCount() {
      throw new Error(
        "<Dots>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set pagesCount(value) {
      throw new Error(
        "<Dots>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get currentPageIndex() {
      throw new Error(
        "<Dots>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set currentPageIndex(value) {
      throw new Error(
        "<Dots>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }
  }

  const PREV = "prev";
  const NEXT = "next";

  /* node_modules/svelte-carousel/src/components/Arrow/Arrow.svelte generated by Svelte v3.59.2 */
  const file$b =
    "node_modules/svelte-carousel/src/components/Arrow/Arrow.svelte";

  function create_fragment$b(ctx) {
    let button;
    let i;
    let mounted;
    let dispose;

    const block = {
      c: function create() {
        button = element("button");
        i = element("i");
        attr_dev(i, "class", "sc-carousel-arrow__arrow svelte-9ztt4p");
        toggle_class(
          i,
          "sc-carousel-arrow__arrow-next",
          /*direction*/ ctx[0] === NEXT,
        );
        toggle_class(
          i,
          "sc-carousel-arrow__arrow-prev",
          /*direction*/ ctx[0] === PREV,
        );
        add_location(i, file$b, 19, 2, 393);
        attr_dev(
          button,
          "class",
          "sc-carousel-button sc-carousel-arrow__circle svelte-9ztt4p",
        );
        toggle_class(
          button,
          "sc-carousel-arrow__circle_disabled",
          /*disabled*/ ctx[1],
        );
        add_location(button, file$b, 14, 0, 256);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, button, anchor);
        append_dev(button, i);

        if (!mounted) {
          dispose = listen_dev(
            button,
            "click",
            /*click_handler*/ ctx[2],
            false,
            false,
            false,
            false,
          );
          mounted = true;
        }
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*direction, NEXT*/ 1) {
          toggle_class(
            i,
            "sc-carousel-arrow__arrow-next",
            /*direction*/ ctx[0] === NEXT,
          );
        }

        if (dirty & /*direction, PREV*/ 1) {
          toggle_class(
            i,
            "sc-carousel-arrow__arrow-prev",
            /*direction*/ ctx[0] === PREV,
          );
        }

        if (dirty & /*disabled*/ 2) {
          toggle_class(
            button,
            "sc-carousel-arrow__circle_disabled",
            /*disabled*/ ctx[1],
          );
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(button);
        mounted = false;
        dispose();
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$b.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$b($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Arrow", slots, []);
    let { direction = NEXT } = $$props;
    let { disabled = false } = $$props;
    const writable_props = ["direction", "disabled"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Arrow> was created with unknown prop '${key}'`);
    });

    function click_handler(event) {
      bubble.call(this, $$self, event);
    }

    $$self.$$set = ($$props) => {
      if ("direction" in $$props)
        $$invalidate(0, (direction = $$props.direction));
      if ("disabled" in $$props) $$invalidate(1, (disabled = $$props.disabled));
    };

    $$self.$capture_state = () => ({ NEXT, PREV, direction, disabled });

    $$self.$inject_state = ($$props) => {
      if ("direction" in $$props)
        $$invalidate(0, (direction = $$props.direction));
      if ("disabled" in $$props) $$invalidate(1, (disabled = $$props.disabled));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [direction, disabled, click_handler];
  }

  class Arrow extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$b, create_fragment$b, safe_not_equal, {
        direction: 0,
        disabled: 1,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Arrow",
        options,
        id: create_fragment$b.name,
      });
    }

    get direction() {
      throw new Error(
        "<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set direction(value) {
      throw new Error(
        "<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get disabled() {
      throw new Error(
        "<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set disabled(value) {
      throw new Error(
        "<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }
  }

  /* node_modules/svelte-carousel/src/components/Progress/Progress.svelte generated by Svelte v3.59.2 */

  const file$a =
    "node_modules/svelte-carousel/src/components/Progress/Progress.svelte";

  function create_fragment$a(ctx) {
    let div;

    const block = {
      c: function create() {
        div = element("div");
        attr_dev(div, "class", "sc-carousel-progress__indicator svelte-nuyenl");
        set_style(div, "width", /*width*/ ctx[0] + "%");
        add_location(div, file$a, 11, 0, 192);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
      },
      p: function update(ctx, [dirty]) {
        if (dirty & /*width*/ 1) {
          set_style(div, "width", /*width*/ ctx[0] + "%");
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$a.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  const MAX_PERCENT = 100;

  function instance$a($$self, $$props, $$invalidate) {
    let width;
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Progress", slots, []);
    let { value = 0 } = $$props;
    const writable_props = ["value"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Progress> was created with unknown prop '${key}'`);
    });

    $$self.$$set = ($$props) => {
      if ("value" in $$props) $$invalidate(1, (value = $$props.value));
    };

    $$self.$capture_state = () => ({ MAX_PERCENT, value, width });

    $$self.$inject_state = ($$props) => {
      if ("value" in $$props) $$invalidate(1, (value = $$props.value));
      if ("width" in $$props) $$invalidate(0, (width = $$props.width));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty & /*value*/ 2) {
        $$invalidate(
          0,
          (width = Math.min(Math.max(value * MAX_PERCENT, 0), MAX_PERCENT)),
        );
      }
    };

    return [width, value];
  }

  class Progress extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$a, create_fragment$a, safe_not_equal, {
        value: 1,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Progress",
        options,
        id: create_fragment$a.name,
      });
    }

    get value() {
      throw new Error(
        "<Progress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set value(value) {
      throw new Error(
        "<Progress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }
  }

  // start event
  function addStartEventListener(source, cb) {
    source.addEventListener("mousedown", cb);
    source.addEventListener("touchstart", cb, { passive: true });
  }
  function removeStartEventListener(source, cb) {
    source.removeEventListener("mousedown", cb);
    source.removeEventListener("touchstart", cb);
  }

  // end event
  function addEndEventListener(source, cb) {
    source.addEventListener("mouseup", cb);
    source.addEventListener("touchend", cb);
  }
  function removeEndEventListener(source, cb) {
    source.removeEventListener("mouseup", cb);
    source.removeEventListener("touchend", cb);
  }

  // move event
  function addMoveEventListener(source, cb) {
    source.addEventListener("mousemove", cb);
    source.addEventListener("touchmove", cb);
  }
  function removeMoveEventListener(source, cb) {
    source.removeEventListener("mousemove", cb);
    source.removeEventListener("touchmove", cb);
  }

  function createDispatcher(source) {
    return function (event, data) {
      source.dispatchEvent(
        new CustomEvent(event, {
          detail: data,
        }),
      );
    };
  }

  const TAP_DURATION_MS = 110;
  const TAP_MOVEMENT_PX = 9; // max movement during the tap, keep it small

  const SWIPE_MIN_DURATION_MS = 111;
  const SWIPE_MIN_DISTANCE_PX = 20;

  function getCoords(event) {
    if ("TouchEvent" in window && event instanceof TouchEvent) {
      const touch = event.touches[0];
      return {
        x: touch ? touch.clientX : 0,
        y: touch ? touch.clientY : 0,
      };
    }
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function swipeable(node, { thresholdProvider }) {
    const dispatch = createDispatcher(node);
    let x;
    let y;
    let moved = 0;
    let swipeStartedAt;
    let isTouching = false;

    function isValidSwipe() {
      const swipeDurationMs = Date.now() - swipeStartedAt;
      return (
        swipeDurationMs >= SWIPE_MIN_DURATION_MS &&
        Math.abs(moved) >= SWIPE_MIN_DISTANCE_PX
      );
    }

    function handleDown(event) {
      swipeStartedAt = Date.now();
      moved = 0;
      isTouching = true;
      const coords = getCoords(event);
      x = coords.x;
      y = coords.y;
      dispatch("swipeStart", { x, y });
      addMoveEventListener(window, handleMove);
      addEndEventListener(window, handleUp);
    }

    function handleMove(event) {
      if (!isTouching) return;
      const coords = getCoords(event);
      const dx = coords.x - x;
      const dy = coords.y - y;
      x = coords.x;
      y = coords.y;
      dispatch("swipeMove", { x, y, dx, dy });

      if (dx !== 0 && Math.sign(dx) !== Math.sign(moved)) {
        moved = 0;
      }
      moved += dx;
      if (Math.abs(moved) > thresholdProvider()) {
        dispatch("swipeThresholdReached", {
          direction: moved > 0 ? PREV : NEXT,
        });
        removeEndEventListener(window, handleUp);
        removeMoveEventListener(window, handleMove);
      }
    }

    function handleUp(event) {
      removeEndEventListener(window, handleUp);
      removeMoveEventListener(window, handleMove);

      isTouching = false;

      if (!isValidSwipe()) {
        dispatch("swipeFailed");
        return;
      }
      const coords = getCoords(event);
      dispatch("swipeEnd", { x: coords.x, y: coords.y });
    }

    addStartEventListener(node, handleDown);
    return {
      destroy() {
        removeStartEventListener(node, handleDown);
      },
    };
  }

  // in event
  function addHoverInEventListener(source, cb) {
    source.addEventListener("mouseenter", cb);
  }
  function removeHoverInEventListener(source, cb) {
    source.removeEventListener("mouseenter", cb);
  }

  // out event
  function addHoverOutEventListener(source, cb) {
    source.addEventListener("mouseleave", cb);
  }
  function removeHoverOutEventListener(source, cb) {
    source.removeEventListener("mouseleave", cb);
  }

  /**
   * hoverable events are for mouse events only
   */
  function hoverable(node) {
    const dispatch = createDispatcher(node);

    function handleHoverIn() {
      addHoverOutEventListener(node, handleHoverOut);
      dispatch("hovered", { value: true });
    }

    function handleHoverOut() {
      dispatch("hovered", { value: false });
      removeHoverOutEventListener(node, handleHoverOut);
    }

    addHoverInEventListener(node, handleHoverIn);

    return {
      destroy() {
        removeHoverInEventListener(node, handleHoverIn);
        removeHoverOutEventListener(node, handleHoverOut);
      },
    };
  }

  const getDistance = (p1, p2) => {
    const xDist = p2.x - p1.x;
    const yDist = p2.y - p1.y;

    return Math.sqrt(xDist * xDist + yDist * yDist);
  };

  function getValueInRange(min, value, max) {
    return Math.max(min, Math.min(value, max));
  }

  // tap start event
  function addFocusinEventListener(source, cb) {
    source.addEventListener("touchstart", cb, { passive: true });
  }
  function removeFocusinEventListener(source, cb) {
    source.removeEventListener("touchstart", cb);
  }

  // tap end event
  function addFocusoutEventListener(source, cb) {
    source.addEventListener("touchend", cb);
  }
  function removeFocusoutEventListener(source, cb) {
    source.removeEventListener("touchend", cb);
  }

  /**
   * tappable events are for touchable devices only
   */
  function tappable(node) {
    const dispatch = createDispatcher(node);

    let tapStartedAt = 0;
    let tapStartPos = { x: 0, y: 0 };

    function getIsValidTap({ tapEndedAt, tapEndedPos }) {
      const tapTime = tapEndedAt - tapStartedAt;
      const tapDist = getDistance(tapStartPos, tapEndedPos);
      return tapTime <= TAP_DURATION_MS && tapDist <= TAP_MOVEMENT_PX;
    }

    function handleTapstart(event) {
      tapStartedAt = Date.now();

      const touch = event.touches[0];
      tapStartPos = { x: touch.clientX, y: touch.clientY };

      addFocusoutEventListener(node, handleTapend);
    }

    function handleTapend(event) {
      removeFocusoutEventListener(node, handleTapend);

      const touch = event.changedTouches[0];
      if (
        getIsValidTap({
          tapEndedAt: Date.now(),
          tapEndedPos: { x: touch.clientX, y: touch.clientY },
        })
      ) {
        dispatch("tapped");
      }
    }

    addFocusinEventListener(node, handleTapstart);

    return {
      destroy() {
        removeFocusinEventListener(node, handleTapstart);
        removeFocusoutEventListener(node, handleTapend);
      },
    };
  }

  // getCurrentPageIndexByCurrentParticleIndex

  function _getCurrentPageIndexByCurrentParticleIndexInfinite({
    currentParticleIndex,
    particlesCount,
    clonesCountHead,
    clonesCountTotal,
    particlesToScroll,
  }) {
    if (currentParticleIndex === particlesCount - clonesCountHead) return 0;
    if (currentParticleIndex === 0)
      return (
        _getPagesCountByParticlesCountInfinite({
          particlesCountWithoutClones: particlesCount - clonesCountTotal,
          particlesToScroll,
        }) - 1
      );
    return Math.floor(
      (currentParticleIndex - clonesCountHead) / particlesToScroll,
    );
  }

  function _getCurrentPageIndexByCurrentParticleIndexLimited({
    currentParticleIndex,
    particlesToScroll,
  }) {
    return Math.ceil(currentParticleIndex / particlesToScroll);
  }

  function getCurrentPageIndexByCurrentParticleIndex({
    currentParticleIndex,
    particlesCount,
    clonesCountHead,
    clonesCountTotal,
    infinite,
    particlesToScroll,
  }) {
    return infinite
      ? _getCurrentPageIndexByCurrentParticleIndexInfinite({
          currentParticleIndex,
          particlesCount,
          clonesCountHead,
          clonesCountTotal,
          particlesToScroll,
        })
      : _getCurrentPageIndexByCurrentParticleIndexLimited({
          currentParticleIndex,
          particlesToScroll,
        });
  }

  // getPagesCountByParticlesCount

  function _getPagesCountByParticlesCountInfinite({
    particlesCountWithoutClones,
    particlesToScroll,
  }) {
    return Math.ceil(particlesCountWithoutClones / particlesToScroll);
  }

  function _getPagesCountByParticlesCountLimited({
    particlesCountWithoutClones,
    particlesToScroll,
    particlesToShow,
  }) {
    const partialPageSize = getPartialPageSize({
      particlesCountWithoutClones,
      particlesToScroll,
      particlesToShow,
    });
    return (
      Math.ceil(particlesCountWithoutClones / particlesToScroll) -
      partialPageSize
    );
  }

  function getPagesCountByParticlesCount({
    infinite,
    particlesCountWithoutClones,
    particlesToScroll,
    particlesToShow,
  }) {
    return infinite
      ? _getPagesCountByParticlesCountInfinite({
          particlesCountWithoutClones,
          particlesToScroll,
        })
      : _getPagesCountByParticlesCountLimited({
          particlesCountWithoutClones,
          particlesToScroll,
          particlesToShow,
        });
  }

  // getParticleIndexByPageIndex

  function _getParticleIndexByPageIndexInfinite({
    pageIndex,
    clonesCountHead,
    clonesCountTail,
    particlesToScroll,
    particlesCount,
  }) {
    return getValueInRange(
      0,
      Math.min(
        clonesCountHead + pageIndex * particlesToScroll,
        particlesCount - clonesCountTail,
      ),
      particlesCount - 1,
    );
  }

  function _getParticleIndexByPageIndexLimited({
    pageIndex,
    particlesToScroll,
    particlesCount,
    particlesToShow,
  }) {
    return getValueInRange(
      0,
      Math.min(pageIndex * particlesToScroll, particlesCount - particlesToShow),
      particlesCount - 1,
    );
  }

  function getParticleIndexByPageIndex({
    infinite,
    pageIndex,
    clonesCountHead,
    clonesCountTail,
    particlesToScroll,
    particlesCount,
    particlesToShow,
  }) {
    return infinite
      ? _getParticleIndexByPageIndexInfinite({
          pageIndex,
          clonesCountHead,
          clonesCountTail,
          particlesToScroll,
          particlesCount,
        })
      : _getParticleIndexByPageIndexLimited({
          pageIndex,
          particlesToScroll,
          particlesCount,
          particlesToShow,
        });
  }

  function applyParticleSizes({ particlesContainerChildren, particleWidth }) {
    for (
      let particleIndex = 0;
      particleIndex < particlesContainerChildren.length;
      particleIndex++
    ) {
      particlesContainerChildren[
        particleIndex
      ].style.minWidth = `${particleWidth}px`;
      particlesContainerChildren[
        particleIndex
      ].style.maxWidth = `${particleWidth}px`;
    }
  }

  function getPartialPageSize({
    particlesToScroll,
    particlesToShow,
    particlesCountWithoutClones,
  }) {
    const overlap = particlesToScroll - particlesToShow;
    let particlesCount = particlesToShow;

    while (true) {
      const diff = particlesCountWithoutClones - particlesCount - overlap;
      if (diff < particlesToShow) {
        return Math.max(diff, 0); // show: 2; scroll: 3, n: 5 => -1
      }
      particlesCount += particlesToShow + overlap;
    }
  }

  function createResizeObserver(onResize) {
    return new ResizeObserver((entries) => {
      onResize({
        width: entries[0].contentRect.width,
      });
    });
  }

  function getClones({
    clonesCountHead,
    clonesCountTail,
    particlesContainerChildren,
  }) {
    // TODO: add fns to remove clones if needed
    const clonesToAppend = [];
    for (let i = 0; i < clonesCountTail; i++) {
      clonesToAppend.push(particlesContainerChildren[i].cloneNode(true));
    }

    const clonesToPrepend = [];
    const len = particlesContainerChildren.length;
    for (let i = len - 1; i > len - 1 - clonesCountHead; i--) {
      clonesToPrepend.push(particlesContainerChildren[i].cloneNode(true));
    }

    return {
      clonesToAppend,
      clonesToPrepend,
    };
  }

  function applyClones({
    particlesContainer,
    clonesToAppend,
    clonesToPrepend,
  }) {
    for (let i = 0; i < clonesToAppend.length; i++) {
      particlesContainer.append(clonesToAppend[i]);
    }
    for (let i = 0; i < clonesToPrepend.length; i++) {
      particlesContainer.prepend(clonesToPrepend[i]);
    }
  }

  function getClonesCount({ infinite, particlesToShow, partialPageSize }) {
    const clonesCount = infinite
      ? {
          // need to round with ceil as particlesToShow, particlesToShow can be floating (e.g. 1.5, 3.75)
          head: Math.ceil(partialPageSize || particlesToShow),
          tail: Math.ceil(particlesToShow),
        }
      : {
          head: 0,
          tail: 0,
        };

    return {
      ...clonesCount,
      total: clonesCount.head + clonesCount.tail,
    };
  }

  const get$1 = (object, fieldName, defaultValue) => {
    if (object && object.hasOwnProperty(fieldName)) {
      return object[fieldName];
    }
    if (defaultValue === undefined) {
      throw new Error(`Required arg "${fieldName}" was not provided`);
    }
    return defaultValue;
  };

  const switcher = (description) => (key) => {
    description[key] && description[key]();
  };

  var commonjsGlobal =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
      ? global
      : typeof self !== "undefined"
      ? self
      : {};

  function createCommonjsModule(fn) {
    var module = { exports: {} };
    return fn(module, module.exports), module.exports;
  }

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  /** Used as the `TypeError` message for "Functions" methods. */
  var FUNC_ERROR_TEXT = "Expected a function";

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = "__lodash_hash_undefined__";

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var funcTag = "[object Function]",
    genTag = "[object GeneratorFunction]",
    symbolTag = "[object Symbol]";

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName =
      /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal =
    typeof commonjsGlobal == "object" &&
    commonjsGlobal &&
    commonjsGlobal.Object === Object &&
    commonjsGlobal;

  /** Detect free variable `self`. */
  var freeSelf =
    typeof self == "object" && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function("return this")();

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != "function") {
      try {
        result = !!(value + "");
      } catch (e) {}
    }
    return result;
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root["__core-js_shared__"];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function () {
    var uid = /[^.]+$/.exec(
      (coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO) || "",
    );
    return uid ? "Symbol(src)_1." + uid : "";
  })();

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp(
    "^" +
      funcToString
        .call(hasOwnProperty)
        .replace(reRegExpChar, "\\$&")
        .replace(
          /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
          "$1.*?",
        ) +
      "$",
  );

  /** Built-in value references. */
  var Symbol$1 = root.Symbol,
    splice = arrayProto.splice;

  /* Built-in method references that are verified to be native. */
  var Map$1 = getNative(root, "Map"),
    nativeCreate = getNative(Object, "create");

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
      length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
  }

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
  }

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate
      ? data[key] !== undefined
      : hasOwnProperty.call(data, key);
  }

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
      length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
  }

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
      index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
      index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
      index = assocIndexOf(data, key);

    if (index < 0) {
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
      length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.__data__ = {
      hash: new Hash(),
      map: new (Map$1 || ListCache)(),
      string: new Hash(),
    };
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    return getMapData(this, key)["delete"](key);
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path) {
    path = isKey(path, object) ? [path] : castPath(path);

    var index = 0,
      length = path.length;

    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : undefined;
  }

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern =
      isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == "string") {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value) {
    return isArray(value) ? value : stringToPath(value);
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == "string" ? "string" : "hash"]
      : data.map;
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (
      type == "number" ||
      type == "symbol" ||
      type == "boolean" ||
      value == null ||
      isSymbol(value)
    ) {
      return true;
    }
    return (
      reIsPlainProp.test(value) ||
      !reIsDeepProp.test(value) ||
      (object != null && value in Object(object))
    );
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return type == "string" ||
      type == "number" ||
      type == "symbol" ||
      type == "boolean"
      ? value !== "__proto__"
      : value === null;
  }

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = memoize(function (string) {
    string = toString(string);

    var result = [];
    if (reLeadingDot.test(string)) {
      result.push("");
    }
    string.replace(rePropName, function (match, number, quote, string) {
      result.push(quote ? string.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY ? "-0" : result;
  }

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to process.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return func + "";
      } catch (e) {}
    }
    return "";
  }

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (
      typeof func != "function" ||
      (resolver && typeof resolver != "function")
    ) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function () {
      var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result);
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }

  // Assign cache to `_.memoize`.
  memoize.Cache = MapCache;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : "";
    return tag == funcTag || tag == genTag;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return !!value && typeof value == "object";
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return (
      typeof value == "symbol" ||
      (isObjectLike(value) && objectToString.call(value) == symbolTag)
    );
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? "" : baseToString(value);
  }

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  var lodash_get = get;

  /**
   * lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright jQuery Foundation and other contributors <https://jquery.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  var lodash_clonedeep = createCommonjsModule(function (module, exports) {
    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = "__lodash_hash_undefined__";

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** `Object#toString` result references. */
    var argsTag = "[object Arguments]",
      arrayTag = "[object Array]",
      boolTag = "[object Boolean]",
      dateTag = "[object Date]",
      errorTag = "[object Error]",
      funcTag = "[object Function]",
      genTag = "[object GeneratorFunction]",
      mapTag = "[object Map]",
      numberTag = "[object Number]",
      objectTag = "[object Object]",
      promiseTag = "[object Promise]",
      regexpTag = "[object RegExp]",
      setTag = "[object Set]",
      stringTag = "[object String]",
      symbolTag = "[object Symbol]",
      weakMapTag = "[object WeakMap]";

    var arrayBufferTag = "[object ArrayBuffer]",
      dataViewTag = "[object DataView]",
      float32Tag = "[object Float32Array]",
      float64Tag = "[object Float64Array]",
      int8Tag = "[object Int8Array]",
      int16Tag = "[object Int16Array]",
      int32Tag = "[object Int32Array]",
      uint8Tag = "[object Uint8Array]",
      uint8ClampedTag = "[object Uint8ClampedArray]",
      uint16Tag = "[object Uint16Array]",
      uint32Tag = "[object Uint32Array]";

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to match `RegExp` flags from their coerced string values. */
    var reFlags = /\w*$/;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /** Used to identify `toStringTag` values supported by `_.clone`. */
    var cloneableTags = {};
    cloneableTags[argsTag] =
      cloneableTags[arrayTag] =
      cloneableTags[arrayBufferTag] =
      cloneableTags[dataViewTag] =
      cloneableTags[boolTag] =
      cloneableTags[dateTag] =
      cloneableTags[float32Tag] =
      cloneableTags[float64Tag] =
      cloneableTags[int8Tag] =
      cloneableTags[int16Tag] =
      cloneableTags[int32Tag] =
      cloneableTags[mapTag] =
      cloneableTags[numberTag] =
      cloneableTags[objectTag] =
      cloneableTags[regexpTag] =
      cloneableTags[setTag] =
      cloneableTags[stringTag] =
      cloneableTags[symbolTag] =
      cloneableTags[uint8Tag] =
      cloneableTags[uint8ClampedTag] =
      cloneableTags[uint16Tag] =
      cloneableTags[uint32Tag] =
        true;
    cloneableTags[errorTag] =
      cloneableTags[funcTag] =
      cloneableTags[weakMapTag] =
        false;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal =
      typeof commonjsGlobal == "object" &&
      commonjsGlobal &&
      commonjsGlobal.Object === Object &&
      commonjsGlobal;

    /** Detect free variable `self`. */
    var freeSelf =
      typeof self == "object" && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function("return this")();

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule =
      freeExports &&
      "object" == "object" &&
      module &&
      !module.nodeType &&
      module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /**
     * Adds the key-value `pair` to `map`.
     *
     * @private
     * @param {Object} map The map to modify.
     * @param {Array} pair The key-value pair to add.
     * @returns {Object} Returns `map`.
     */
    function addMapEntry(map, pair) {
      // Don't return `map.set` because it's not chainable in IE 11.
      map.set(pair[0], pair[1]);
      return map;
    }

    /**
     * Adds `value` to `set`.
     *
     * @private
     * @param {Object} set The set to modify.
     * @param {*} value The value to add.
     * @returns {Object} Returns `set`.
     */
    function addSetEntry(set, value) {
      // Don't return `set.add` because it's not chainable in IE 11.
      set.add(value);
      return set;
    }

    /**
     * A specialized version of `_.forEach` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns `array`.
     */
    function arrayEach(array, iteratee) {
      var index = -1,
        length = array ? array.length : 0;

      while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
        length = values.length,
        offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.reduce` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @param {*} [accumulator] The initial value.
     * @param {boolean} [initAccum] Specify using the first element of `array` as
     *  the initial value.
     * @returns {*} Returns the accumulated value.
     */
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1,
        length = array ? array.length : 0;

      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
        result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Checks if `value` is a host object in IE < 9.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
     */
    function isHostObject(value) {
      // Many host objects are `Object` objects that can coerce to strings
      // despite having improperly defined `toString` methods.
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {}
      }
      return result;
    }

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */
    function mapToArray(map) {
      var index = -1,
        result = Array(map.size);

      map.forEach(function (value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function (arg) {
        return func(transform(arg));
      };
    }

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */
    function setToArray(set) {
      var index = -1,
        result = Array(set.size);

      set.forEach(function (value) {
        result[++index] = value;
      });
      return result;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root["__core-js_shared__"];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function () {
      var uid = /[^.]+$/.exec(
        (coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO) || "",
      );
      return uid ? "Symbol(src)_1." + uid : "";
    })();

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp(
      "^" +
        funcToString
          .call(hasOwnProperty)
          .replace(reRegExpChar, "\\$&")
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            "$1.*?",
          ) +
        "$",
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined,
      Symbol = root.Symbol,
      Uint8Array = root.Uint8Array,
      getPrototype = overArg(Object.getPrototypeOf, Object),
      objectCreate = Object.create,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      splice = arrayProto.splice;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols,
      nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
      nativeKeys = overArg(Object.keys, Object);

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(root, "DataView"),
      Map = getNative(root, "Map"),
      Promise = getNative(root, "Promise"),
      Set = getNative(root, "Set"),
      WeakMap = getNative(root, "WeakMap"),
      nativeCreate = getNative(Object, "create");

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
      mapCtorString = toSource(Map),
      promiseCtorString = toSource(Promise),
      setCtorString = toSource(Set),
      weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
        length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate
        ? data[key] !== undefined
        : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
        length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
        index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
        index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
        index = assocIndexOf(data, key);

      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
        length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.__data__ = {
        hash: new Hash(),
        map: new (Map || ListCache)(),
        string: new Hash(),
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      return getMapData(this, key)["delete"](key);
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      this.__data__ = new ListCache(entries);
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache();
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      return this.__data__["delete"](key);
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var cache = this.__data__;
      if (cache instanceof ListCache) {
        var pairs = cache.__data__;
        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          return this;
        }
        cache = this.__data__ = new MapCache(pairs);
      }
      cache.set(key, value);
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
      // Safari 9 makes `arguments.length` enumerable in strict mode.
      var result =
        isArray(value) || isArguments(value)
          ? baseTimes(value.length, String)
          : [];

      var length = result.length,
        skipIndexes = !!length;

      for (var key in value) {
        if (
          (inherited || hasOwnProperty.call(value, key)) &&
          !(skipIndexes && (key == "length" || isIndex(key, length)))
        ) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Assigns `value` to `key` of `object` if the existing value is not equivalent
     * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * for equality comparisons.
     *
     * @private
     * @param {Object} object The object to modify.
     * @param {string} key The key of the property to assign.
     * @param {*} value The value to assign.
     */
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (
        !(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
        (value === undefined && !(key in object))
      ) {
        object[key] = value;
      }
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.assign` without support for multiple sources
     * or `customizer` functions.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @returns {Object} Returns `object`.
     */
    function baseAssign(object, source) {
      return object && copyObject(source, keys(source), object);
    }

    /**
     * The base implementation of `_.clone` and `_.cloneDeep` which tracks
     * traversed objects.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @param {boolean} [isFull] Specify a clone including symbols.
     * @param {Function} [customizer] The function to customize cloning.
     * @param {string} [key] The key of `value`.
     * @param {Object} [object] The parent object of `value`.
     * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
      var result;
      if (customizer) {
        result = object
          ? customizer(value, key, object, stack)
          : customizer(value);
      }
      if (result !== undefined) {
        return result;
      }
      if (!isObject(value)) {
        return value;
      }
      var isArr = isArray(value);
      if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
          return copyArray(value, result);
        }
      } else {
        var tag = getTag(value),
          isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
          return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
          if (isHostObject(value)) {
            return object ? value : {};
          }
          result = initCloneObject(isFunc ? {} : value);
          if (!isDeep) {
            return copySymbols(value, baseAssign(result, value));
          }
        } else {
          if (!cloneableTags[tag]) {
            return object ? value : {};
          }
          result = initCloneByTag(value, tag, baseClone, isDeep);
        }
      }
      // Check for circular references and return its corresponding clone.
      stack || (stack = new Stack());
      var stacked = stack.get(value);
      if (stacked) {
        return stacked;
      }
      stack.set(value, result);

      if (!isArr) {
        var props = isFull ? getAllKeys(value) : keys(value);
      }
      arrayEach(props || value, function (subValue, key) {
        if (props) {
          key = subValue;
          subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(
          result,
          key,
          baseClone(subValue, isDeep, isFull, customizer, key, value, stack),
        );
      });
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(proto) {
      return isObject(proto) ? objectCreate(proto) : {};
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      return objectToString.call(value);
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern =
        isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var result = new buffer.constructor(buffer.length);
      buffer.copy(result);
      return result;
    }

    /**
     * Creates a clone of `arrayBuffer`.
     *
     * @private
     * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
     * @returns {ArrayBuffer} Returns the cloned array buffer.
     */
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array(result).set(new Uint8Array(arrayBuffer));
      return result;
    }

    /**
     * Creates a clone of `dataView`.
     *
     * @private
     * @param {Object} dataView The data view to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned data view.
     */
    function cloneDataView(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(
        buffer,
        dataView.byteOffset,
        dataView.byteLength,
      );
    }

    /**
     * Creates a clone of `map`.
     *
     * @private
     * @param {Object} map The map to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned map.
     */
    function cloneMap(map, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
      return arrayReduce(array, addMapEntry, new map.constructor());
    }

    /**
     * Creates a clone of `regexp`.
     *
     * @private
     * @param {Object} regexp The regexp to clone.
     * @returns {Object} Returns the cloned regexp.
     */
    function cloneRegExp(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }

    /**
     * Creates a clone of `set`.
     *
     * @private
     * @param {Object} set The set to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned set.
     */
    function cloneSet(set, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
      return arrayReduce(array, addSetEntry, new set.constructor());
    }

    /**
     * Creates a clone of the `symbol` object.
     *
     * @private
     * @param {Object} symbol The symbol object to clone.
     * @returns {Object} Returns the cloned symbol object.
     */
    function cloneSymbol(symbol) {
      return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
    }

    /**
     * Creates a clone of `typedArray`.
     *
     * @private
     * @param {Object} typedArray The typed array to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the cloned typed array.
     */
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep
        ? cloneArrayBuffer(typedArray.buffer)
        : typedArray.buffer;
      return new typedArray.constructor(
        buffer,
        typedArray.byteOffset,
        typedArray.length,
      );
    }

    /**
     * Copies the values of `source` to `array`.
     *
     * @private
     * @param {Array} source The array to copy values from.
     * @param {Array} [array=[]] The array to copy values to.
     * @returns {Array} Returns `array`.
     */
    function copyArray(source, array) {
      var index = -1,
        length = source.length;

      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }

    /**
     * Copies properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy properties from.
     * @param {Array} props The property identifiers to copy.
     * @param {Object} [object={}] The object to copy properties to.
     * @param {Function} [customizer] The function to customize copied values.
     * @returns {Object} Returns `object`.
     */
    function copyObject(source, props, object, customizer) {
      object || (object = {});

      var index = -1,
        length = props.length;

      while (++index < length) {
        var key = props[index];

        var newValue = customizer
          ? customizer(object[key], source[key], key, object, source)
          : undefined;

        assignValue(
          object,
          key,
          newValue === undefined ? source[key] : newValue,
        );
      }
      return object;
    }

    /**
     * Copies own symbol properties of `source` to `object`.
     *
     * @private
     * @param {Object} source The object to copy symbols from.
     * @param {Object} [object={}] The object to copy symbols to.
     * @returns {Object} Returns `object`.
     */
    function copySymbols(source, object) {
      return copyObject(source, getSymbols(source), object);
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == "string" ? "string" : "hash"]
        : data.map;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * Creates an array of the own enumerable symbol properties of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = nativeGetSymbols
      ? overArg(nativeGetSymbols, Object)
      : stubArray;

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11,
    // for data views in Edge < 14, and promises in Node.js.
    if (
      (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
      (Map && getTag(new Map()) != mapTag) ||
      (Promise && getTag(Promise.resolve()) != promiseTag) ||
      (Set && getTag(new Set()) != setTag) ||
      (WeakMap && getTag(new WeakMap()) != weakMapTag)
    ) {
      getTag = function (value) {
        var result = objectToString.call(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : undefined;

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Initializes an array clone.
     *
     * @private
     * @param {Array} array The array to clone.
     * @returns {Array} Returns the initialized clone.
     */
    function initCloneArray(array) {
      var length = array.length,
        result = array.constructor(length);

      // Add properties assigned by `RegExp#exec`.
      if (
        length &&
        typeof array[0] == "string" &&
        hasOwnProperty.call(array, "index")
      ) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }

    /**
     * Initializes an object clone.
     *
     * @private
     * @param {Object} object The object to clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object)
        ? baseCreate(getPrototype(object))
        : {};
    }

    /**
     * Initializes an object clone based on its `toStringTag`.
     *
     * **Note:** This function only supports cloning values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to clone.
     * @param {string} tag The `toStringTag` of the object to clone.
     * @param {Function} cloneFunc The function to clone values.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Object} Returns the initialized clone.
     */
    function initCloneByTag(object, tag, cloneFunc, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag:
          return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
          return new Ctor(+object);

        case dataViewTag:
          return cloneDataView(object, isDeep);

        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
          return cloneTypedArray(object, isDeep);

        case mapTag:
          return cloneMap(object, isDeep, cloneFunc);

        case numberTag:
        case stringTag:
          return new Ctor(object);

        case regexpTag:
          return cloneRegExp(object);

        case setTag:
          return cloneSet(object, isDeep, cloneFunc);

        case symbolTag:
          return cloneSymbol(object);
      }
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return (
        !!length &&
        (typeof value == "number" || reIsUint.test(value)) &&
        value > -1 &&
        value % 1 == 0 &&
        value < length
      );
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" ||
        type == "number" ||
        type == "symbol" ||
        type == "boolean"
        ? value !== "__proto__"
        : value === null;
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
        proto = (typeof Ctor == "function" && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to process.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return func + "";
        } catch (e) {}
      }
      return "";
    }

    /**
     * This method is like `_.clone` except that it recursively clones `value`.
     *
     * @static
     * @memberOf _
     * @since 1.0.0
     * @category Lang
     * @param {*} value The value to recursively clone.
     * @returns {*} Returns the deep cloned value.
     * @see _.clone
     * @example
     *
     * var objects = [{ 'a': 1 }, { 'b': 2 }];
     *
     * var deep = _.cloneDeep(objects);
     * console.log(deep[0] === objects[0]);
     * // => false
     */
    function cloneDeep(value) {
      return baseClone(value, true, true);
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
      return (
        isArrayLikeObject(value) &&
        hasOwnProperty.call(value, "callee") &&
        (!propertyIsEnumerable.call(value, "callee") ||
          objectToString.call(value) == argsTag)
      );
    }

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * This method is like `_.isArrayLike` except that it also checks if `value`
     * is an object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array-like object,
     *  else `false`.
     * @example
     *
     * _.isArrayLikeObject([1, 2, 3]);
     * // => true
     *
     * _.isArrayLikeObject(document.body.children);
     * // => true
     *
     * _.isArrayLikeObject('abc');
     * // => false
     *
     * _.isArrayLikeObject(_.noop);
     * // => false
     */
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8-9 which returns 'object' for typed array and other constructors.
      var tag = isObject(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return (
        typeof value == "number" &&
        value > -1 &&
        value % 1 == 0 &&
        value <= MAX_SAFE_INTEGER
      );
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    module.exports = cloneDeep;
  });

  /**
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="npm" -o ./`
   * Copyright JS Foundation and other contributors <https://js.foundation/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  var lodash_isequal = createCommonjsModule(function (module, exports) {
    /** Used as the size to enable large array optimizations. */
    var LARGE_ARRAY_SIZE = 200;

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = "__lodash_hash_undefined__";

    /** Used to compose bitmasks for value comparisons. */
    var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

    /** Used as references for various `Number` constants. */
    var MAX_SAFE_INTEGER = 9007199254740991;

    /** `Object#toString` result references. */
    var argsTag = "[object Arguments]",
      arrayTag = "[object Array]",
      asyncTag = "[object AsyncFunction]",
      boolTag = "[object Boolean]",
      dateTag = "[object Date]",
      errorTag = "[object Error]",
      funcTag = "[object Function]",
      genTag = "[object GeneratorFunction]",
      mapTag = "[object Map]",
      numberTag = "[object Number]",
      nullTag = "[object Null]",
      objectTag = "[object Object]",
      promiseTag = "[object Promise]",
      proxyTag = "[object Proxy]",
      regexpTag = "[object RegExp]",
      setTag = "[object Set]",
      stringTag = "[object String]",
      symbolTag = "[object Symbol]",
      undefinedTag = "[object Undefined]",
      weakMapTag = "[object WeakMap]";

    var arrayBufferTag = "[object ArrayBuffer]",
      dataViewTag = "[object DataView]",
      float32Tag = "[object Float32Array]",
      float64Tag = "[object Float64Array]",
      int8Tag = "[object Int8Array]",
      int16Tag = "[object Int16Array]",
      int32Tag = "[object Int32Array]",
      uint8Tag = "[object Uint8Array]",
      uint8ClampedTag = "[object Uint8ClampedArray]",
      uint16Tag = "[object Uint16Array]",
      uint32Tag = "[object Uint32Array]";

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /** Used to identify `toStringTag` values of typed arrays. */
    var typedArrayTags = {};
    typedArrayTags[float32Tag] =
      typedArrayTags[float64Tag] =
      typedArrayTags[int8Tag] =
      typedArrayTags[int16Tag] =
      typedArrayTags[int32Tag] =
      typedArrayTags[uint8Tag] =
      typedArrayTags[uint8ClampedTag] =
      typedArrayTags[uint16Tag] =
      typedArrayTags[uint32Tag] =
        true;
    typedArrayTags[argsTag] =
      typedArrayTags[arrayTag] =
      typedArrayTags[arrayBufferTag] =
      typedArrayTags[boolTag] =
      typedArrayTags[dataViewTag] =
      typedArrayTags[dateTag] =
      typedArrayTags[errorTag] =
      typedArrayTags[funcTag] =
      typedArrayTags[mapTag] =
      typedArrayTags[numberTag] =
      typedArrayTags[objectTag] =
      typedArrayTags[regexpTag] =
      typedArrayTags[setTag] =
      typedArrayTags[stringTag] =
      typedArrayTags[weakMapTag] =
        false;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal =
      typeof commonjsGlobal == "object" &&
      commonjsGlobal &&
      commonjsGlobal.Object === Object &&
      commonjsGlobal;

    /** Detect free variable `self`. */
    var freeSelf =
      typeof self == "object" && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function("return this")();

    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule =
      freeExports &&
      "object" == "object" &&
      module &&
      !module.nodeType &&
      module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function () {
      try {
        return (
          freeProcess && freeProcess.binding && freeProcess.binding("util")
        );
      } catch (e) {}
    })();

    /* Node.js helper references. */
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

    /**
     * A specialized version of `_.filter` for arrays without support for
     * iteratee shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {Array} Returns the new filtered array.
     */
    function arrayFilter(array, predicate) {
      var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }

    /**
     * Appends the elements of `values` to `array`.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {Array} values The values to append.
     * @returns {Array} Returns `array`.
     */
    function arrayPush(array, values) {
      var index = -1,
        length = values.length,
        offset = array.length;

      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }

    /**
     * A specialized version of `_.some` for arrays without support for iteratee
     * shorthands.
     *
     * @private
     * @param {Array} [array] The array to iterate over.
     * @param {Function} predicate The function invoked per iteration.
     * @returns {boolean} Returns `true` if any element passes the predicate check,
     *  else `false`.
     */
    function arraySome(array, predicate) {
      var index = -1,
        length = array == null ? 0 : array.length;

      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }

    /**
     * The base implementation of `_.times` without support for iteratee shorthands
     * or max array length checks.
     *
     * @private
     * @param {number} n The number of times to invoke `iteratee`.
     * @param {Function} iteratee The function invoked per iteration.
     * @returns {Array} Returns the array of results.
     */
    function baseTimes(n, iteratee) {
      var index = -1,
        result = Array(n);

      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }

    /**
     * The base implementation of `_.unary` without support for storing metadata.
     *
     * @private
     * @param {Function} func The function to cap arguments for.
     * @returns {Function} Returns the new capped function.
     */
    function baseUnary(func) {
      return function (value) {
        return func(value);
      };
    }

    /**
     * Checks if a `cache` value for `key` exists.
     *
     * @private
     * @param {Object} cache The cache to query.
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function cacheHas(cache, key) {
      return cache.has(key);
    }

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Converts `map` to its key-value pairs.
     *
     * @private
     * @param {Object} map The map to convert.
     * @returns {Array} Returns the key-value pairs.
     */
    function mapToArray(map) {
      var index = -1,
        result = Array(map.size);

      map.forEach(function (value, key) {
        result[++index] = [key, value];
      });
      return result;
    }

    /**
     * Creates a unary function that invokes `func` with its argument transformed.
     *
     * @private
     * @param {Function} func The function to wrap.
     * @param {Function} transform The argument transform.
     * @returns {Function} Returns the new function.
     */
    function overArg(func, transform) {
      return function (arg) {
        return func(transform(arg));
      };
    }

    /**
     * Converts `set` to an array of its values.
     *
     * @private
     * @param {Object} set The set to convert.
     * @returns {Array} Returns the values.
     */
    function setToArray(set) {
      var index = -1,
        result = Array(set.size);

      set.forEach(function (value) {
        result[++index] = value;
      });
      return result;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root["__core-js_shared__"];

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function () {
      var uid = /[^.]+$/.exec(
        (coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO) || "",
      );
      return uid ? "Symbol(src)_1." + uid : "";
    })();

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp(
      "^" +
        funcToString
          .call(hasOwnProperty)
          .replace(reRegExpChar, "\\$&")
          .replace(
            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
            "$1.*?",
          ) +
        "$",
    );

    /** Built-in value references. */
    var Buffer = moduleExports ? root.Buffer : undefined,
      Symbol = root.Symbol,
      Uint8Array = root.Uint8Array,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      splice = arrayProto.splice,
      symToStringTag = Symbol ? Symbol.toStringTag : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeGetSymbols = Object.getOwnPropertySymbols,
      nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
      nativeKeys = overArg(Object.keys, Object);

    /* Built-in method references that are verified to be native. */
    var DataView = getNative(root, "DataView"),
      Map = getNative(root, "Map"),
      Promise = getNative(root, "Promise"),
      Set = getNative(root, "Set"),
      WeakMap = getNative(root, "WeakMap"),
      nativeCreate = getNative(Object, "create");

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = toSource(DataView),
      mapCtorString = toSource(Map),
      promiseCtorString = toSource(Promise),
      setCtorString = toSource(Set),
      weakMapCtorString = toSource(WeakMap);

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
        length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate
        ? data[key] !== undefined
        : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
        length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
        index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
        index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
        index = assocIndexOf(data, key);

      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
        length = entries == null ? 0 : entries.length;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        hash: new Hash(),
        map: new (Map || ListCache)(),
        string: new Hash(),
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      var data = getMapData(this, key),
        size = data.size;

      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /**
     *
     * Creates an array cache object to store unique values.
     *
     * @private
     * @constructor
     * @param {Array} [values] The values to cache.
     */
    function SetCache(values) {
      var index = -1,
        length = values == null ? 0 : values.length;

      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }

    /**
     * Adds `value` to the array cache.
     *
     * @private
     * @name add
     * @memberOf SetCache
     * @alias push
     * @param {*} value The value to cache.
     * @returns {Object} Returns the cache instance.
     */
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }

    /**
     * Checks if `value` is in the array cache.
     *
     * @private
     * @name has
     * @memberOf SetCache
     * @param {*} value The value to search for.
     * @returns {number} Returns `true` if `value` is found, else `false`.
     */
    function setCacheHas(value) {
      return this.__data__.has(value);
    }

    // Add methods to `SetCache`.
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;

    /**
     * Creates a stack cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Stack(entries) {
      var data = (this.__data__ = new ListCache(entries));
      this.size = data.size;
    }

    /**
     * Removes all key-value entries from the stack.
     *
     * @private
     * @name clear
     * @memberOf Stack
     */
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }

    /**
     * Removes `key` and its value from the stack.
     *
     * @private
     * @name delete
     * @memberOf Stack
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function stackDelete(key) {
      var data = this.__data__,
        result = data["delete"](key);

      this.size = data.size;
      return result;
    }

    /**
     * Gets the stack value for `key`.
     *
     * @private
     * @name get
     * @memberOf Stack
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function stackGet(key) {
      return this.__data__.get(key);
    }

    /**
     * Checks if a stack value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Stack
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function stackHas(key) {
      return this.__data__.has(key);
    }

    /**
     * Sets the stack `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Stack
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the stack cache instance.
     */
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }

    // Add methods to `Stack`.
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;

    /**
     * Creates an array of the enumerable property names of the array-like `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @param {boolean} inherited Specify returning inherited property names.
     * @returns {Array} Returns the array of property names.
     */
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

      for (var key in value) {
        if (
          (inherited || hasOwnProperty.call(value, key)) &&
          !(
            skipIndexes &&
            // Safari 9 has enumerable `arguments.length` in strict mode.
            (key == "length" ||
              // Node.js 0.10 has enumerable non-index properties on buffers.
              (isBuff && (key == "offset" || key == "parent")) ||
              // PhantomJS 2 has enumerable non-index properties on typed arrays.
              (isType &&
                (key == "buffer" ||
                  key == "byteLength" ||
                  key == "byteOffset")) ||
              // Skip index properties.
              isIndex(key, length))
          )
        ) {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
     * `keysFunc` and `symbolsFunc` to get the enumerable property names and
     * symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {Function} keysFunc The function to get the keys of `object`.
     * @param {Function} symbolsFunc The function to get the symbols of `object`.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value)
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }

    /**
     * The base implementation of `_.isEqual` which supports partial comparisons
     * and tracks traversed objects.
     *
     * @private
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @param {boolean} bitmask The bitmask flags.
     *  1 - Unordered comparison
     *  2 - Partial comparison
     * @param {Function} [customizer] The function to customize comparisons.
     * @param {Object} [stack] Tracks traversed `value` and `other` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (
        value == null ||
        other == null ||
        (!isObjectLike(value) && !isObjectLike(other))
      ) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(
        value,
        other,
        bitmask,
        customizer,
        baseIsEqual,
        stack,
      );
    }

    /**
     * A specialized version of `baseIsEqual` for arrays and objects which performs
     * deep comparisons and tracks traversed objects enabling objects with circular
     * references to be compared.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} [stack] Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function baseIsEqualDeep(
      object,
      other,
      bitmask,
      customizer,
      equalFunc,
      stack,
    ) {
      var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = objIsArr ? arrayTag : getTag(object),
        othTag = othIsArr ? arrayTag : getTag(other);

      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;

      var objIsObj = objTag == objectTag,
        othIsObj = othTag == objectTag,
        isSameTag = objTag == othTag;

      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object)
          ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
          : equalByTag(
              object,
              other,
              objTag,
              bitmask,
              customizer,
              equalFunc,
              stack,
            );
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped =
            objIsObj && hasOwnProperty.call(object, "__wrapped__"),
          othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");

        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;

          stack || (stack = new Stack());
          return equalFunc(
            objUnwrapped,
            othUnwrapped,
            bitmask,
            customizer,
            stack,
          );
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack());
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * The base implementation of `_.isTypedArray` without Node.js optimizations.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     */
    function baseIsTypedArray(value) {
      return (
        isObjectLike(value) &&
        isLength(value.length) &&
        !!typedArrayTags[baseGetTag(value)]
      );
    }

    /**
     * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     */
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for arrays with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Array} array The array to compare.
     * @param {Array} other The other array to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `array` and `other` objects.
     * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
     */
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        arrLength = array.length,
        othLength = other.length;

      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1,
        result = true,
        seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined;

      stack.set(array, other);
      stack.set(other, array);

      // Ignore non-index properties.
      while (++index < arrLength) {
        var arrValue = array[index],
          othValue = other[index];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, arrValue, index, other, array, stack)
            : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== undefined) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
          if (
            !arraySome(other, function (othValue, othIndex) {
              if (
                !cacheHas(seen, othIndex) &&
                (arrValue === othValue ||
                  equalFunc(arrValue, othValue, bitmask, customizer, stack))
              ) {
                return seen.push(othIndex);
              }
            })
          ) {
            result = false;
            break;
          }
        } else if (
          !(
            arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
          )
        ) {
          result = false;
          break;
        }
      }
      stack["delete"](array);
      stack["delete"](other);
      return result;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for comparing objects of
     * the same `toStringTag`.
     *
     * **Note:** This function only supports comparing values with tags of
     * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {string} tag The `toStringTag` of the objects to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalByTag(
      object,
      other,
      tag,
      bitmask,
      customizer,
      equalFunc,
      stack,
    ) {
      switch (tag) {
        case dataViewTag:
          if (
            object.byteLength != other.byteLength ||
            object.byteOffset != other.byteOffset
          ) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;

        case arrayBufferTag:
          if (
            object.byteLength != other.byteLength ||
            !equalFunc(new Uint8Array(object), new Uint8Array(other))
          ) {
            return false;
          }
          return true;

        case boolTag:
        case dateTag:
        case numberTag:
          // Coerce booleans to `1` or `0` and dates to milliseconds.
          // Invalid dates are coerced to `NaN`.
          return eq(+object, +other);

        case errorTag:
          return object.name == other.name && object.message == other.message;

        case regexpTag:
        case stringTag:
          // Coerce regexes to strings and treat strings, primitives and objects,
          // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
          // for more details.
          return object == other + "";

        case mapTag:
          var convert = mapToArray;

        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);

          if (object.size != other.size && !isPartial) {
            return false;
          }
          // Assume cyclic values are equal.
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;

          // Recursively compare objects (susceptible to call stack limits).
          stack.set(object, other);
          var result = equalArrays(
            convert(object),
            convert(other),
            bitmask,
            customizer,
            equalFunc,
            stack,
          );
          stack["delete"](object);
          return result;

        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }

    /**
     * A specialized version of `baseIsEqualDeep` for objects with support for
     * partial deep comparisons.
     *
     * @private
     * @param {Object} object The object to compare.
     * @param {Object} other The other object to compare.
     * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
     * @param {Function} customizer The function to customize comparisons.
     * @param {Function} equalFunc The function to determine equivalents of values.
     * @param {Object} stack Tracks traversed `object` and `other` objects.
     * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
     */
    function equalObjects(
      object,
      other,
      bitmask,
      customizer,
      equalFunc,
      stack,
    ) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        objProps = getAllKeys(object),
        objLength = objProps.length,
        othProps = getAllKeys(other),
        othLength = othProps.length;

      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);

      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key],
          othValue = other[key];

        if (customizer) {
          var compared = isPartial
            ? customizer(othValue, objValue, key, other, object, stack)
            : customizer(objValue, othValue, key, object, other, stack);
        }
        // Recursively compare objects (susceptible to call stack limits).
        if (
          !(compared === undefined
            ? objValue === othValue ||
              equalFunc(objValue, othValue, bitmask, customizer, stack)
            : compared)
        ) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor,
          othCtor = other.constructor;

        // Non `Object` object instances with different constructors are not equal.
        if (
          objCtor != othCtor &&
          "constructor" in object &&
          "constructor" in other &&
          !(
            typeof objCtor == "function" &&
            objCtor instanceof objCtor &&
            typeof othCtor == "function" &&
            othCtor instanceof othCtor
          )
        ) {
          result = false;
        }
      }
      stack["delete"](object);
      stack["delete"](other);
      return result;
    }

    /**
     * Creates an array of own enumerable property names and symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names and symbols.
     */
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == "string" ? "string" : "hash"]
        : data.map;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    /**
     * Creates an array of the own enumerable symbols of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of symbols.
     */
    var getSymbols = !nativeGetSymbols
      ? stubArray
      : function (object) {
          if (object == null) {
            return [];
          }
          object = Object(object);
          return arrayFilter(nativeGetSymbols(object), function (symbol) {
            return propertyIsEnumerable.call(object, symbol);
          });
        };

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if (
      (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
      (Map && getTag(new Map()) != mapTag) ||
      (Promise && getTag(Promise.resolve()) != promiseTag) ||
      (Set && getTag(new Set()) != setTag) ||
      (WeakMap && getTag(new WeakMap()) != weakMapTag)
    ) {
      getTag = function (value) {
        var result = baseGetTag(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : "";

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }

    /**
     * Checks if `value` is a valid array-like index.
     *
     * @private
     * @param {*} value The value to check.
     * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
     * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
     */
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return (
        !!length &&
        (typeof value == "number" || reIsUint.test(value)) &&
        value > -1 &&
        value % 1 == 0 &&
        value < length
      );
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" ||
        type == "number" ||
        type == "symbol" ||
        type == "boolean"
        ? value !== "__proto__"
        : value === null;
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }

    /**
     * Checks if `value` is likely a prototype object.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
     */
    function isPrototype(value) {
      var Ctor = value && value.constructor,
        proto = (typeof Ctor == "function" && Ctor.prototype) || objectProto;

      return value === proto;
    }

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return func + "";
        } catch (e) {}
      }
      return "";
    }

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = baseIsArguments(
      (function () {
        return arguments;
      })(),
    )
      ? baseIsArguments
      : function (value) {
          return (
            isObjectLike(value) &&
            hasOwnProperty.call(value, "callee") &&
            !propertyIsEnumerable.call(value, "callee")
          );
        };

    /**
     * Checks if `value` is classified as an `Array` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an array, else `false`.
     * @example
     *
     * _.isArray([1, 2, 3]);
     * // => true
     *
     * _.isArray(document.body.children);
     * // => false
     *
     * _.isArray('abc');
     * // => false
     *
     * _.isArray(_.noop);
     * // => false
     */
    var isArray = Array.isArray;

    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * _.isArrayLike([1, 2, 3]);
     * // => true
     *
     * _.isArrayLike(document.body.children);
     * // => true
     *
     * _.isArrayLike('abc');
     * // => true
     *
     * _.isArrayLike(_.noop);
     * // => false
     */
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse;

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent.
     *
     * **Note:** This method supports comparing arrays, array buffers, booleans,
     * date objects, error objects, maps, numbers, `Object` objects, regexes,
     * sets, strings, symbols, and typed arrays. `Object` objects are compared
     * by their own, not inherited, enumerable properties. Functions and DOM
     * nodes are compared by strict equality, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.isEqual(object, other);
     * // => true
     *
     * object === other;
     * // => false
     */
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = baseGetTag(value);
      return (
        tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag
      );
    }

    /**
     * Checks if `value` is a valid array-like length.
     *
     * **Note:** This method is loosely based on
     * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
     * @example
     *
     * _.isLength(3);
     * // => true
     *
     * _.isLength(Number.MIN_VALUE);
     * // => false
     *
     * _.isLength(Infinity);
     * // => false
     *
     * _.isLength('3');
     * // => false
     */
    function isLength(value) {
      return (
        typeof value == "number" &&
        value > -1 &&
        value % 1 == 0 &&
        value <= MAX_SAFE_INTEGER
      );
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }

    /**
     * Checks if `value` is classified as a typed array.
     *
     * @static
     * @memberOf _
     * @since 3.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
     * @example
     *
     * _.isTypedArray(new Uint8Array);
     * // => true
     *
     * _.isTypedArray([]);
     * // => false
     */
    var isTypedArray = nodeIsTypedArray
      ? baseUnary(nodeIsTypedArray)
      : baseIsTypedArray;

    /**
     * Creates an array of the own enumerable property names of `object`.
     *
     * **Note:** Non-object values are coerced to objects. See the
     * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
     * for more details.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Object
     * @param {Object} object The object to query.
     * @returns {Array} Returns the array of property names.
     * @example
     *
     * function Foo() {
     *   this.a = 1;
     *   this.b = 2;
     * }
     *
     * Foo.prototype.c = 3;
     *
     * _.keys(new Foo);
     * // => ['a', 'b'] (iteration order is not guaranteed)
     *
     * _.keys('hi');
     * // => ['0', '1']
     */
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }

    /**
     * This method returns a new empty array.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {Array} Returns the new empty array.
     * @example
     *
     * var arrays = _.times(2, _.stubArray);
     *
     * console.log(arrays);
     * // => [[], []]
     *
     * console.log(arrays[0] === arrays[1]);
     * // => false
     */
    function stubArray() {
      return [];
    }

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    module.exports = isEqual;
  });

  const depsAreEqual = (deps1, deps2) => {
    return lodash_isequal(deps1, deps2);
  };

  const getDepNames = (deps) => {
    return Object.keys(deps || {});
  };

  const getUpdatedDeps = (depNames, currentData) => {
    const updatedDeps = {};
    depNames.forEach((depName) => {
      updatedDeps[depName] = currentData[depName];
    });
    return updatedDeps;
  };

  const createSubscription = () => {
    const subscribers = {};

    const memoDependency = (target, dep) => {
      const { watcherName, fn } = target;
      const { prop, value } = dep;

      if (!subscribers[watcherName]) {
        subscribers[watcherName] = {
          deps: {},
          fn,
        };
      }
      subscribers[watcherName].deps[prop] = value;
    };

    return {
      subscribers,
      subscribe(target, dep) {
        if (target) {
          memoDependency(target, dep);
        }
      },
      notify(data, prop) {
        Object.entries(subscribers).forEach(([watchName, { deps, fn }]) => {
          const depNames = getDepNames(deps);

          if (depNames.includes(prop)) {
            const updatedDeps = getUpdatedDeps(depNames, data);
            if (!depsAreEqual(deps, updatedDeps)) {
              subscribers[watchName].deps = updatedDeps;
              fn();
            }
          }
        });
      },
    };
  };

  const createTargetWatcher = () => {
    let target = null;

    return {
      targetWatcher(watcherName, fn) {
        target = {
          watcherName,
          fn,
        };
        target.fn();
        target = null;
      },
      getTarget() {
        return target;
      },
    };
  };

  function simplyReactive(entities, options) {
    const data = lodash_get(entities, "data", {});
    const watch = lodash_get(entities, "watch", {});
    const methods = lodash_get(entities, "methods", {});
    const onChange = lodash_get(options, "onChange", () => {});

    const { subscribe, notify, subscribers } = createSubscription();
    const { targetWatcher, getTarget } = createTargetWatcher();

    let _data;
    const _methods = {};
    const getContext = () => ({
      data: _data,
      methods: _methods,
    });

    let callingMethod = false;
    const methodWithFlags =
      (fn) =>
      (...args) => {
        callingMethod = true;
        const result = fn(...args);
        callingMethod = false;
        return result;
      };

    // init methods before data, as methods may be used in data
    Object.entries(methods).forEach(([methodName, methodItem]) => {
      _methods[methodName] = methodWithFlags((...args) =>
        methodItem(getContext(), ...args),
      );
      Object.defineProperty(_methods[methodName], "name", {
        value: methodName,
      });
    });

    _data = new Proxy(lodash_clonedeep(data), {
      get(target, prop) {
        if (getTarget() && !callingMethod) {
          subscribe(getTarget(), { prop, value: target[prop] });
        }
        return Reflect.get(...arguments);
      },
      set(target, prop, value) {
        // if value is the same, do nothing
        if (target[prop] === value) {
          return true;
        }

        Reflect.set(...arguments);

        if (!getTarget()) {
          onChange && onChange(prop, value);
          notify(_data, prop);
        }

        return true;
      },
    });

    Object.entries(watch).forEach(([watchName, watchItem]) => {
      targetWatcher(watchName, () => {
        watchItem(getContext());
      });
    });

    const output = [_data, _methods];
    output._internal = {
      _getSubscribers() {
        return subscribers;
      },
    };

    return output;
  }

  function getIndexesOfParticlesWithoutClonesInPage({
    pageIndex,
    particlesToShow,
    particlesToScroll,
    particlesCount,
  }) {
    const overlap = pageIndex === 0 ? 0 : particlesToShow - particlesToScroll;
    const from = pageIndex * particlesToShow - pageIndex * overlap;
    const to = from + Math.max(particlesToShow, particlesToScroll) - 1;
    const indexes = [];
    for (let i = from; i <= Math.min(particlesCount - 1, to); i++) {
      indexes.push(i);
    }
    return indexes;
  }

  function getAdjacentIndexes({
    infinite,
    pageIndex,
    pagesCount,
    particlesCount,
    particlesToShow,
    particlesToScroll,
  }) {
    const _pageIndex = getValueInRange(0, pageIndex, pagesCount - 1);

    let rangeStart = _pageIndex - 1;
    let rangeEnd = _pageIndex + 1;

    rangeStart = infinite
      ? rangeStart < 0
        ? pagesCount - 1
        : rangeStart
      : Math.max(0, rangeStart);

    rangeEnd = infinite
      ? rangeEnd > pagesCount - 1
        ? 0
        : rangeEnd
      : Math.min(pagesCount - 1, rangeEnd);

    const pageIndexes = [
      ...new Set([
        rangeStart,
        _pageIndex,
        rangeEnd,

        // because of these values outputs for infinite/non-infinites are the same
        0, // needed to clone first page particles
        pagesCount - 1, // needed to clone last page particles
      ]),
    ].sort((a, b) => a - b);
    const particleIndexes = pageIndexes.flatMap((pageIndex) =>
      getIndexesOfParticlesWithoutClonesInPage({
        pageIndex,
        particlesToShow,
        particlesToScroll,
        particlesCount,
      }),
    );
    return {
      pageIndexes,
      particleIndexes: [...new Set(particleIndexes)].sort((a, b) => a - b),
    };
  }

  const setIntervalImmediate = (fn, ms) => {
    fn();
    return setInterval(fn, ms);
  };

  const STEP_MS = 35;
  const MAX_VALUE = 1;

  class ProgressManager {
    constructor({ onProgressValueChange }) {
      this._onProgressValueChange = onProgressValueChange;

      this._autoplayDuration;
      this._onProgressValueChange;

      this._interval;
      this._paused = false;
    }

    setAutoplayDuration(autoplayDuration) {
      this._autoplayDuration = autoplayDuration;
    }

    start(onFinish) {
      return new Promise((resolve) => {
        this.reset();

        const stepMs = Math.min(STEP_MS, Math.max(this._autoplayDuration, 1));
        let progress = -stepMs;

        this._interval = setIntervalImmediate(async () => {
          if (this._paused) {
            return;
          }
          progress += stepMs;

          const value = progress / this._autoplayDuration;
          this._onProgressValueChange(value);

          if (value > MAX_VALUE) {
            this.reset();
            await onFinish();
            resolve();
          }
        }, stepMs);
      });
    }

    pause() {
      this._paused = true;
    }

    resume() {
      this._paused = false;
    }

    reset() {
      clearInterval(this._interval);
      this._onProgressValueChange(MAX_VALUE);
    }
  }

  function createCarousel(onChange) {
    const progressManager = new ProgressManager({
      onProgressValueChange: (value) => {
        onChange("progressValue", 1 - value);
      },
    });

    const reactive = simplyReactive(
      {
        data: {
          particlesCountWithoutClones: 0,
          particlesToShow: 1, // normalized
          particlesToShowInit: 1, // initial value
          particlesToScroll: 1, // normalized
          particlesToScrollInit: 1, // initial value
          particlesCount: 1,
          currentParticleIndex: 1,
          infinite: false,
          autoplayDuration: 1000,
          clonesCountHead: 0,
          clonesCountTail: 0,
          clonesCountTotal: 0,
          partialPageSize: 1,
          currentPageIndex: 1,
          pagesCount: 1,
          pauseOnFocus: false,
          focused: false,
          autoplay: false,
          autoplayDirection: "next",
          disabled: false, // disable page change while animation is in progress
          durationMsInit: 1000,
          durationMs: 1000,
          offset: 0,
          particleWidth: 0,
          loaded: [],
        },
        watch: {
          setLoaded({ data }) {
            data.loaded = getAdjacentIndexes({
              infinite: data.infinite,
              pageIndex: data.currentPageIndex,
              pagesCount: data.pagesCount,
              particlesCount: data.particlesCountWithoutClones,
              particlesToShow: data.particlesToShow,
              particlesToScroll: data.particlesToScroll,
            }).particleIndexes;
          },
          setCurrentPageIndex({ data }) {
            data.currentPageIndex = getCurrentPageIndexByCurrentParticleIndex({
              currentParticleIndex: data.currentParticleIndex,
              particlesCount: data.particlesCount,
              clonesCountHead: data.clonesCountHead,
              clonesCountTotal: data.clonesCountTotal,
              infinite: data.infinite,
              particlesToScroll: data.particlesToScroll,
            });
          },
          setPartialPageSize({ data }) {
            data.partialPageSize = getPartialPageSize({
              particlesToScroll: data.particlesToScroll,
              particlesToShow: data.particlesToShow,
              particlesCountWithoutClones: data.particlesCountWithoutClones,
            });
          },
          setClonesCount({ data }) {
            const { head, tail } = getClonesCount({
              infinite: data.infinite,
              particlesToShow: data.particlesToShow,
              partialPageSize: data.partialPageSize,
            });
            data.clonesCountHead = head;
            data.clonesCountTail = tail;
            data.clonesCountTotal = head + tail;
          },
          setProgressManagerAutoplayDuration({ data }) {
            progressManager.setAutoplayDuration(data.autoplayDuration);
          },
          toggleProgressManager({ data: { pauseOnFocus, focused } }) {
            // as focused is in if block, it will not be put to deps, read them in data: {}
            if (pauseOnFocus) {
              if (focused) {
                progressManager.pause();
              } else {
                progressManager.resume();
              }
            }
          },
          initDuration({ data }) {
            data.durationMs = data.durationMsInit;
          },
          applyAutoplay({ data, methods: { _applyAutoplayIfNeeded } }) {
            // prevent _applyAutoplayIfNeeded to be called with watcher
            // to prevent its data added to deps
            data.autoplay && _applyAutoplayIfNeeded(data.autoplay);
          },
          setPagesCount({ data }) {
            data.pagesCount = getPagesCountByParticlesCount({
              infinite: data.infinite,
              particlesCountWithoutClones: data.particlesCountWithoutClones,
              particlesToScroll: data.particlesToScroll,
              particlesToShow: data.particlesToShow,
            });
          },
          setParticlesToShow({ data }) {
            data.particlesToShow = getValueInRange(
              1,
              data.particlesToShowInit,
              data.particlesCountWithoutClones,
            );
          },
          setParticlesToScroll({ data }) {
            data.particlesToScroll = getValueInRange(
              1,
              data.particlesToScrollInit,
              data.particlesCountWithoutClones,
            );
          },
        },
        methods: {
          _prev({ data }) {
            data.currentParticleIndex = getParticleIndexByPageIndex({
              infinite: data.infinite,
              pageIndex: data.currentPageIndex - 1,
              clonesCountHead: data.clonesCountHead,
              clonesCountTail: data.clonesCountTail,
              particlesToScroll: data.particlesToScroll,
              particlesCount: data.particlesCount,
              particlesToShow: data.particlesToShow,
            });
          },
          _next({ data }) {
            data.currentParticleIndex = getParticleIndexByPageIndex({
              infinite: data.infinite,
              pageIndex: data.currentPageIndex + 1,
              clonesCountHead: data.clonesCountHead,
              clonesCountTail: data.clonesCountTail,
              particlesToScroll: data.particlesToScroll,
              particlesCount: data.particlesCount,
              particlesToShow: data.particlesToShow,
            });
          },
          _moveToParticle({ data }, particleIndex) {
            data.currentParticleIndex = getValueInRange(
              0,
              particleIndex,
              data.particlesCount - 1,
            );
          },
          toggleFocused({ data }) {
            data.focused = !data.focused;
          },
          async _applyAutoplayIfNeeded({ data, methods }) {
            // prevent progress change if not infinite for first and last page
            if (
              !data.infinite &&
              ((data.autoplayDirection === NEXT &&
                data.currentParticleIndex === data.particlesCount - 1) ||
                (data.autoplayDirection === PREV &&
                  data.currentParticleIndex === 0))
            ) {
              progressManager.reset();
              return;
            }

            if (data.autoplay) {
              const onFinish = () =>
                switcher({
                  [NEXT]: async () => methods.showNextPage(),
                  [PREV]: async () => methods.showPrevPage(),
                })(data.autoplayDirection);

              await progressManager.start(onFinish);
            }
          },
          // makes delayed jump to 1st or last element
          async _jumpIfNeeded({ data, methods }) {
            let jumped = false;
            if (data.infinite) {
              if (data.currentParticleIndex === 0) {
                await methods.showParticle(
                  data.particlesCount - data.clonesCountTotal,
                  {
                    animated: false,
                  },
                );
                jumped = true;
              } else if (
                data.currentParticleIndex ===
                data.particlesCount - data.clonesCountTail
              ) {
                await methods.showParticle(data.clonesCountHead, {
                  animated: false,
                });
                jumped = true;
              }
            }
            return jumped;
          },
          async changePage({ data, methods }, updateStoreFn, options) {
            progressManager.reset();
            if (data.disabled) return;
            data.disabled = true;

            updateStoreFn();
            await methods.offsetPage({
              animated: get$1(options, "animated", true),
            });
            data.disabled = false;

            const jumped = await methods._jumpIfNeeded();
            !jumped && methods._applyAutoplayIfNeeded(); // no need to wait it finishes
          },
          async showNextPage({ data, methods }, options) {
            if (data.disabled) return;
            await methods.changePage(methods._next, options);
          },
          async showPrevPage({ data, methods }, options) {
            if (data.disabled) return;
            await methods.changePage(methods._prev, options);
          },
          async showParticle({ methods }, particleIndex, options) {
            await methods.changePage(
              () => methods._moveToParticle(particleIndex),
              options,
            );
          },
          _getParticleIndexByPageIndex({ data }, pageIndex) {
            return getParticleIndexByPageIndex({
              infinite: data.infinite,
              pageIndex,
              clonesCountHead: data.clonesCountHead,
              clonesCountTail: data.clonesCountTail,
              particlesToScroll: data.particlesToScroll,
              particlesCount: data.particlesCount,
              particlesToShow: data.particlesToShow,
            });
          },
          async showPage({ methods }, pageIndex, options) {
            const particleIndex =
              methods._getParticleIndexByPageIndex(pageIndex);
            await methods.showParticle(particleIndex, options);
          },
          offsetPage({ data }, options) {
            const animated = get$1(options, "animated", true);
            return new Promise((resolve) => {
              // durationMs is an offset animation time
              data.durationMs = animated ? data.durationMsInit : 0;
              data.offset = -data.currentParticleIndex * data.particleWidth;
              setTimeout(() => {
                resolve();
              }, data.durationMs);
            });
          },
        },
      },
      {
        onChange,
      },
    );
    const [data, methods] = reactive;

    return [{ data, progressManager }, methods, reactive._internal];
  }

  /* node_modules/svelte-carousel/src/components/Carousel/Carousel.svelte generated by Svelte v3.59.2 */

  const { Error: Error_1 } = globals;
  const file$9 =
    "node_modules/svelte-carousel/src/components/Carousel/Carousel.svelte";

  const get_dots_slot_changes = (dirty) => ({
    currentPageIndex: dirty[0] & /*currentPageIndex*/ 32,
    pagesCount: dirty[0] & /*pagesCount*/ 1024,
    loaded: dirty[0] & /*loaded*/ 64,
  });

  const get_dots_slot_context = (ctx) => ({
    currentPageIndex: /*currentPageIndex*/ ctx[5],
    pagesCount: /*pagesCount*/ ctx[10],
    showPage: /*handlePageChange*/ ctx[15],
    loaded: /*loaded*/ ctx[6],
  });

  const get_next_slot_changes = (dirty) => ({
    loaded: dirty[0] & /*loaded*/ 64,
    currentPageIndex: dirty[0] & /*currentPageIndex*/ 32,
  });

  const get_next_slot_context = (ctx) => ({
    showNextPage: /*methods*/ ctx[14].showNextPage,
    loaded: /*loaded*/ ctx[6],
    currentPageIndex: /*currentPageIndex*/ ctx[5],
  });

  const get_default_slot_changes = (dirty) => ({
    loaded: dirty[0] & /*loaded*/ 64,
    currentPageIndex: dirty[0] & /*currentPageIndex*/ 32,
  });

  const get_default_slot_context = (ctx) => ({
    loaded: /*loaded*/ ctx[6],
    currentPageIndex: /*currentPageIndex*/ ctx[5],
  });

  const get_prev_slot_changes = (dirty) => ({
    loaded: dirty[0] & /*loaded*/ 64,
    currentPageIndex: dirty[0] & /*currentPageIndex*/ 32,
  });

  const get_prev_slot_context = (ctx) => ({
    showPrevPage: /*methods*/ ctx[14].showPrevPage,
    loaded: /*loaded*/ ctx[6],
    currentPageIndex: /*currentPageIndex*/ ctx[5],
  });

  // (259:4) {#if arrows}
  function create_if_block_3(ctx) {
    let current;
    const prev_slot_template = /*#slots*/ ctx[37].prev;
    const prev_slot = create_slot(
      prev_slot_template,
      ctx,
      /*$$scope*/ ctx[36],
      get_prev_slot_context,
    );
    const prev_slot_or_fallback = prev_slot || fallback_block_2(ctx);

    const block = {
      c: function create() {
        if (prev_slot_or_fallback) prev_slot_or_fallback.c();
      },
      m: function mount(target, anchor) {
        if (prev_slot_or_fallback) {
          prev_slot_or_fallback.m(target, anchor);
        }

        current = true;
      },
      p: function update(ctx, dirty) {
        if (prev_slot) {
          if (
            prev_slot.p &&
            (!current ||
              (dirty[0] & /*loaded, currentPageIndex*/ 96) |
                (dirty[1] & /*$$scope*/ 32))
          ) {
            update_slot_base(
              prev_slot,
              prev_slot_template,
              ctx,
              /*$$scope*/ ctx[36],
              !current
                ? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
                : get_slot_changes(
                    prev_slot_template,
                    /*$$scope*/ ctx[36],
                    dirty,
                    get_prev_slot_changes,
                  ),
              get_prev_slot_context,
            );
          }
        } else {
          if (
            prev_slot_or_fallback &&
            prev_slot_or_fallback.p &&
            (!current || dirty[0] & /*infinite, currentPageIndex*/ 36)
          ) {
            prev_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
          }
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(prev_slot_or_fallback, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(prev_slot_or_fallback, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (prev_slot_or_fallback) prev_slot_or_fallback.d(detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_3.name,
      type: "if",
      source: "(259:4) {#if arrows}",
      ctx,
    });

    return block;
  }

  // (260:60)
  function fallback_block_2(ctx) {
    let div;
    let arrow;
    let current;

    arrow = new Arrow({
      props: {
        direction: "prev",
        disabled: !(/*infinite*/ ctx[2]) && /*currentPageIndex*/ ctx[5] === 0,
      },
      $$inline: true,
    });

    arrow.$on("click", /*showPrevPage*/ ctx[23]);

    const block = {
      c: function create() {
        div = element("div");
        create_component(arrow.$$.fragment);
        attr_dev(div, "class", "sc-carousel__arrow-container svelte-uwo0yk");
        add_location(div, file$9, 260, 8, 6343);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        mount_component(arrow, div, null);
        current = true;
      },
      p: function update(ctx, dirty) {
        const arrow_changes = {};
        if (dirty[0] & /*infinite, currentPageIndex*/ 36)
          arrow_changes.disabled =
            !(/*infinite*/ ctx[2]) && /*currentPageIndex*/ ctx[5] === 0;
        arrow.$set(arrow_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(arrow.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(arrow.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_component(arrow);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: fallback_block_2.name,
      type: "fallback",
      source: "(260:60)           ",
      ctx,
    });

    return block;
  }

  // (297:6) {#if autoplayProgressVisible}
  function create_if_block_2$1(ctx) {
    let div;
    let progress;
    let current;

    progress = new Progress({
      props: { value: /*progressValue*/ ctx[7] },
      $$inline: true,
    });

    const block = {
      c: function create() {
        div = element("div");
        create_component(progress.$$.fragment);
        attr_dev(div, "class", "sc-carousel-progress__container svelte-uwo0yk");
        add_location(div, file$9, 297, 8, 7492);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        mount_component(progress, div, null);
        current = true;
      },
      p: function update(ctx, dirty) {
        const progress_changes = {};
        if (dirty[0] & /*progressValue*/ 128)
          progress_changes.value = /*progressValue*/ ctx[7];
        progress.$set(progress_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(progress.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(progress.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_component(progress);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2$1.name,
      type: "if",
      source: "(297:6) {#if autoplayProgressVisible}",
      ctx,
    });

    return block;
  }

  // (303:4) {#if arrows}
  function create_if_block_1$1(ctx) {
    let current;
    const next_slot_template = /*#slots*/ ctx[37].next;
    const next_slot = create_slot(
      next_slot_template,
      ctx,
      /*$$scope*/ ctx[36],
      get_next_slot_context,
    );
    const next_slot_or_fallback = next_slot || fallback_block_1(ctx);

    const block = {
      c: function create() {
        if (next_slot_or_fallback) next_slot_or_fallback.c();
      },
      m: function mount(target, anchor) {
        if (next_slot_or_fallback) {
          next_slot_or_fallback.m(target, anchor);
        }

        current = true;
      },
      p: function update(ctx, dirty) {
        if (next_slot) {
          if (
            next_slot.p &&
            (!current ||
              (dirty[0] & /*loaded, currentPageIndex*/ 96) |
                (dirty[1] & /*$$scope*/ 32))
          ) {
            update_slot_base(
              next_slot,
              next_slot_template,
              ctx,
              /*$$scope*/ ctx[36],
              !current
                ? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
                : get_slot_changes(
                    next_slot_template,
                    /*$$scope*/ ctx[36],
                    dirty,
                    get_next_slot_changes,
                  ),
              get_next_slot_context,
            );
          }
        } else {
          if (
            next_slot_or_fallback &&
            next_slot_or_fallback.p &&
            (!current ||
              dirty[0] & /*infinite, currentPageIndex, pagesCount*/ 1060)
          ) {
            next_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
          }
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(next_slot_or_fallback, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(next_slot_or_fallback, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (next_slot_or_fallback) next_slot_or_fallback.d(detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1$1.name,
      type: "if",
      source: "(303:4) {#if arrows}",
      ctx,
    });

    return block;
  }

  // (304:60)
  function fallback_block_1(ctx) {
    let div;
    let arrow;
    let current;

    arrow = new Arrow({
      props: {
        direction: "next",
        disabled:
          !(/*infinite*/ ctx[2]) &&
          /*currentPageIndex*/ ctx[5] === /*pagesCount*/ ctx[10] - 1,
      },
      $$inline: true,
    });

    arrow.$on("click", /*methods*/ ctx[14].showNextPage);

    const block = {
      c: function create() {
        div = element("div");
        create_component(arrow.$$.fragment);
        attr_dev(div, "class", "sc-carousel__arrow-container svelte-uwo0yk");
        add_location(div, file$9, 304, 8, 7714);
      },
      m: function mount(target, anchor) {
        insert_dev(target, div, anchor);
        mount_component(arrow, div, null);
        current = true;
      },
      p: function update(ctx, dirty) {
        const arrow_changes = {};
        if (dirty[0] & /*infinite, currentPageIndex, pagesCount*/ 1060)
          arrow_changes.disabled =
            !(/*infinite*/ ctx[2]) &&
            /*currentPageIndex*/ ctx[5] === /*pagesCount*/ ctx[10] - 1;
        arrow.$set(arrow_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(arrow.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(arrow.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div);
        destroy_component(arrow);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: fallback_block_1.name,
      type: "fallback",
      source: "(304:60)           ",
      ctx,
    });

    return block;
  }

  // (315:2) {#if dots}
  function create_if_block$1(ctx) {
    let current;
    const dots_slot_template = /*#slots*/ ctx[37].dots;
    const dots_slot = create_slot(
      dots_slot_template,
      ctx,
      /*$$scope*/ ctx[36],
      get_dots_slot_context,
    );
    const dots_slot_or_fallback = dots_slot || fallback_block(ctx);

    const block = {
      c: function create() {
        if (dots_slot_or_fallback) dots_slot_or_fallback.c();
      },
      m: function mount(target, anchor) {
        if (dots_slot_or_fallback) {
          dots_slot_or_fallback.m(target, anchor);
        }

        current = true;
      },
      p: function update(ctx, dirty) {
        if (dots_slot) {
          if (
            dots_slot.p &&
            (!current ||
              (dirty[0] & /*currentPageIndex, pagesCount, loaded*/ 1120) |
                (dirty[1] & /*$$scope*/ 32))
          ) {
            update_slot_base(
              dots_slot,
              dots_slot_template,
              ctx,
              /*$$scope*/ ctx[36],
              !current
                ? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
                : get_slot_changes(
                    dots_slot_template,
                    /*$$scope*/ ctx[36],
                    dirty,
                    get_dots_slot_changes,
                  ),
              get_dots_slot_context,
            );
          }
        } else {
          if (
            dots_slot_or_fallback &&
            dots_slot_or_fallback.p &&
            (!current || dirty[0] & /*pagesCount, currentPageIndex*/ 1056)
          ) {
            dots_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
          }
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(dots_slot_or_fallback, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(dots_slot_or_fallback, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (dots_slot_or_fallback) dots_slot_or_fallback.d(detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block$1.name,
      type: "if",
      source: "(315:2) {#if dots}",
      ctx,
    });

    return block;
  }

  // (321:5)
  function fallback_block(ctx) {
    let dots_1;
    let current;

    dots_1 = new Dots({
      props: {
        pagesCount: /*pagesCount*/ ctx[10],
        currentPageIndex: /*currentPageIndex*/ ctx[5],
      },
      $$inline: true,
    });

    dots_1.$on("pageChange", /*pageChange_handler*/ ctx[41]);

    const block = {
      c: function create() {
        create_component(dots_1.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(dots_1, target, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        const dots_1_changes = {};
        if (dirty[0] & /*pagesCount*/ 1024)
          dots_1_changes.pagesCount = /*pagesCount*/ ctx[10];
        if (dirty[0] & /*currentPageIndex*/ 32)
          dots_1_changes.currentPageIndex = /*currentPageIndex*/ ctx[5];
        dots_1.$set(dots_1_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(dots_1.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(dots_1.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(dots_1, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: fallback_block.name,
      type: "fallback",
      source: "(321:5)         ",
      ctx,
    });

    return block;
  }

  function create_fragment$9(ctx) {
    let div3;
    let div2;
    let t0;
    let div1;
    let div0;
    let swipeable_action;
    let t1;
    let t2;
    let t3;
    let current;
    let mounted;
    let dispose;
    let if_block0 = /*arrows*/ ctx[1] && create_if_block_3(ctx);
    const default_slot_template = /*#slots*/ ctx[37].default;
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/ ctx[36],
      get_default_slot_context,
    );
    let if_block1 =
      /*autoplayProgressVisible*/ ctx[3] && create_if_block_2$1(ctx);
    let if_block2 = /*arrows*/ ctx[1] && create_if_block_1$1(ctx);
    let if_block3 = /*dots*/ ctx[4] && create_if_block$1(ctx);

    const block = {
      c: function create() {
        div3 = element("div");
        div2 = element("div");
        if (if_block0) if_block0.c();
        t0 = space();
        div1 = element("div");
        div0 = element("div");
        if (default_slot) default_slot.c();
        t1 = space();
        if (if_block1) if_block1.c();
        t2 = space();
        if (if_block2) if_block2.c();
        t3 = space();
        if (if_block3) if_block3.c();
        attr_dev(div0, "class", "sc-carousel__pages-container svelte-uwo0yk");
        set_style(div0, "transform", "translateX(" + /*offset*/ ctx[8] + "px)");
        set_style(div0, "transition-duration", /*durationMs*/ ctx[9] + "ms");
        set_style(
          div0,
          "transition-timing-function",
          /*timingFunction*/ ctx[0],
        );
        add_location(div0, file$9, 279, 6, 6800);
        attr_dev(div1, "class", "sc-carousel__pages-window svelte-uwo0yk");
        add_location(div1, file$9, 269, 4, 6592);
        attr_dev(div2, "class", "sc-carousel__content-container svelte-uwo0yk");
        add_location(div2, file$9, 257, 2, 6209);
        attr_dev(
          div3,
          "class",
          "sc-carousel__carousel-container svelte-uwo0yk",
        );
        add_location(div3, file$9, 256, 0, 6160);
      },
      l: function claim(nodes) {
        throw new Error_1(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, div3, anchor);
        append_dev(div3, div2);
        if (if_block0) if_block0.m(div2, null);
        append_dev(div2, t0);
        append_dev(div2, div1);
        append_dev(div1, div0);

        if (default_slot) {
          default_slot.m(div0, null);
        }

        /*div0_binding*/ ctx[39](div0);
        append_dev(div1, t1);
        if (if_block1) if_block1.m(div1, null);
        /*div1_binding*/ ctx[40](div1);
        append_dev(div2, t2);
        if (if_block2) if_block2.m(div2, null);
        append_dev(div3, t3);
        if (if_block3) if_block3.m(div3, null);
        current = true;

        if (!mounted) {
          dispose = [
            action_destroyer(
              (swipeable_action = swipeable.call(null, div0, {
                thresholdProvider: /*swipeable_function*/ ctx[38],
              })),
            ),
            listen_dev(
              div0,
              "swipeStart",
              /*handleSwipeStart*/ ctx[16],
              false,
              false,
              false,
              false,
            ),
            listen_dev(
              div0,
              "swipeMove",
              /*handleSwipeMove*/ ctx[18],
              false,
              false,
              false,
              false,
            ),
            listen_dev(
              div0,
              "swipeEnd",
              /*handleSwipeEnd*/ ctx[19],
              false,
              false,
              false,
              false,
            ),
            listen_dev(
              div0,
              "swipeFailed",
              /*handleSwipeFailed*/ ctx[20],
              false,
              false,
              false,
              false,
            ),
            listen_dev(
              div0,
              "swipeThresholdReached",
              /*handleSwipeThresholdReached*/ ctx[17],
              false,
              false,
              false,
              false,
            ),
            action_destroyer(hoverable.call(null, div1)),
            listen_dev(
              div1,
              "hovered",
              /*handleHovered*/ ctx[21],
              false,
              false,
              false,
              false,
            ),
            action_destroyer(tappable.call(null, div1)),
            listen_dev(
              div1,
              "tapped",
              /*handleTapped*/ ctx[22],
              false,
              false,
              false,
              false,
            ),
          ];

          mounted = true;
        }
      },
      p: function update(ctx, dirty) {
        if (/*arrows*/ ctx[1]) {
          if (if_block0) {
            if_block0.p(ctx, dirty);

            if (dirty[0] & /*arrows*/ 2) {
              transition_in(if_block0, 1);
            }
          } else {
            if_block0 = create_if_block_3(ctx);
            if_block0.c();
            transition_in(if_block0, 1);
            if_block0.m(div2, t0);
          }
        } else if (if_block0) {
          group_outros();

          transition_out(if_block0, 1, 1, () => {
            if_block0 = null;
          });

          check_outros();
        }

        if (default_slot) {
          if (
            default_slot.p &&
            (!current ||
              (dirty[0] & /*loaded, currentPageIndex*/ 96) |
                (dirty[1] & /*$$scope*/ 32))
          ) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx,
              /*$$scope*/ ctx[36],
              !current
                ? get_all_dirty_from_scope(/*$$scope*/ ctx[36])
                : get_slot_changes(
                    default_slot_template,
                    /*$$scope*/ ctx[36],
                    dirty,
                    get_default_slot_changes,
                  ),
              get_default_slot_context,
            );
          }
        }

        if (!current || dirty[0] & /*offset*/ 256) {
          set_style(
            div0,
            "transform",
            "translateX(" + /*offset*/ ctx[8] + "px)",
          );
        }

        if (!current || dirty[0] & /*durationMs*/ 512) {
          set_style(div0, "transition-duration", /*durationMs*/ ctx[9] + "ms");
        }

        if (!current || dirty[0] & /*timingFunction*/ 1) {
          set_style(
            div0,
            "transition-timing-function",
            /*timingFunction*/ ctx[0],
          );
        }

        if (
          swipeable_action &&
          is_function(swipeable_action.update) &&
          dirty[0] & /*pageWindowWidth*/ 2048
        )
          swipeable_action.update.call(null, {
            thresholdProvider: /*swipeable_function*/ ctx[38],
          });

        if (/*autoplayProgressVisible*/ ctx[3]) {
          if (if_block1) {
            if_block1.p(ctx, dirty);

            if (dirty[0] & /*autoplayProgressVisible*/ 8) {
              transition_in(if_block1, 1);
            }
          } else {
            if_block1 = create_if_block_2$1(ctx);
            if_block1.c();
            transition_in(if_block1, 1);
            if_block1.m(div1, null);
          }
        } else if (if_block1) {
          group_outros();

          transition_out(if_block1, 1, 1, () => {
            if_block1 = null;
          });

          check_outros();
        }

        if (/*arrows*/ ctx[1]) {
          if (if_block2) {
            if_block2.p(ctx, dirty);

            if (dirty[0] & /*arrows*/ 2) {
              transition_in(if_block2, 1);
            }
          } else {
            if_block2 = create_if_block_1$1(ctx);
            if_block2.c();
            transition_in(if_block2, 1);
            if_block2.m(div2, null);
          }
        } else if (if_block2) {
          group_outros();

          transition_out(if_block2, 1, 1, () => {
            if_block2 = null;
          });

          check_outros();
        }

        if (/*dots*/ ctx[4]) {
          if (if_block3) {
            if_block3.p(ctx, dirty);

            if (dirty[0] & /*dots*/ 16) {
              transition_in(if_block3, 1);
            }
          } else {
            if_block3 = create_if_block$1(ctx);
            if_block3.c();
            transition_in(if_block3, 1);
            if_block3.m(div3, null);
          }
        } else if (if_block3) {
          group_outros();

          transition_out(if_block3, 1, 1, () => {
            if_block3 = null;
          });

          check_outros();
        }
      },
      i: function intro(local) {
        if (current) return;
        transition_in(if_block0);
        transition_in(default_slot, local);
        transition_in(if_block1);
        transition_in(if_block2);
        transition_in(if_block3);
        current = true;
      },
      o: function outro(local) {
        transition_out(if_block0);
        transition_out(default_slot, local);
        transition_out(if_block1);
        transition_out(if_block2);
        transition_out(if_block3);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(div3);
        if (if_block0) if_block0.d();
        if (default_slot) default_slot.d(detaching);
        /*div0_binding*/ ctx[39](null);
        if (if_block1) if_block1.d();
        /*div1_binding*/ ctx[40](null);
        if (if_block2) if_block2.d();
        if (if_block3) if_block3.d();
        mounted = false;
        run_all(dispose);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$9.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$9($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Carousel", slots, ["prev", "default", "next", "dots"]);
    let loaded = [];
    let currentPageIndex;
    let progressValue;
    let offset = 0;
    let durationMs = 0;
    let pagesCount = 1;

    const [{ data, progressManager }, methods, service] = createCarousel(
      (key, value) => {
        switcher({
          currentPageIndex: () => $$invalidate(5, (currentPageIndex = value)),
          progressValue: () => $$invalidate(7, (progressValue = value)),
          offset: () => $$invalidate(8, (offset = value)),
          durationMs: () => $$invalidate(9, (durationMs = value)),
          pagesCount: () => $$invalidate(10, (pagesCount = value)),
          loaded: () => $$invalidate(6, (loaded = value)),
        })(key);
      },
    );

    const dispatch = createEventDispatcher();
    let { timingFunction = "ease-in-out" } = $$props;
    let { arrows = true } = $$props;
    let { infinite = true } = $$props;
    let { initialPageIndex = 0 } = $$props;
    let { duration = 500 } = $$props;
    let { autoplay = false } = $$props;
    let { autoplayDuration = 3000 } = $$props;
    let { autoplayDirection = NEXT } = $$props;
    let { pauseOnFocus = false } = $$props;
    let { autoplayProgressVisible = false } = $$props;
    let { dots = true } = $$props;
    let { swiping = true } = $$props;
    let { particlesToShow = 1 } = $$props;
    let { particlesToScroll = 1 } = $$props;

    async function goTo(pageIndex, options) {
      const animated = get$1(options, "animated", true);

      if (typeof pageIndex !== "number") {
        throw new Error("pageIndex should be a number");
      }

      await methods.showPage(pageIndex, { animated });
    }

    async function goToPrev(options) {
      const animated = get$1(options, "animated", true);
      await methods.showPrevPage({ animated });
    }

    async function goToNext(options) {
      const animated = get$1(options, "animated", true);
      await methods.showNextPage({ animated });
    }

    let pageWindowWidth = 0;
    let pageWindowElement;
    let particlesContainer;

    const pageWindowElementResizeObserver = createResizeObserver(
      ({ width }) => {
        $$invalidate(11, (pageWindowWidth = width));
        data.particleWidth = pageWindowWidth / data.particlesToShow;

        applyParticleSizes({
          particlesContainerChildren: particlesContainer.children,
          particleWidth: data.particleWidth,
        });

        methods.offsetPage({ animated: false });
      },
    );

    function addClones() {
      const { clonesToAppend, clonesToPrepend } = getClones({
        clonesCountHead: data.clonesCountHead,
        clonesCountTail: data.clonesCountTail,
        particlesContainerChildren: particlesContainer.children,
      });

      applyClones({
        particlesContainer,
        clonesToAppend,
        clonesToPrepend,
      });
    }

    onMount(() => {
      (async () => {
        await tick();

        if (particlesContainer && pageWindowElement) {
          data.particlesCountWithoutClones = particlesContainer.children.length;
          await tick();
          data.infinite && addClones();

          // call after adding clones
          data.particlesCount = particlesContainer.children.length;

          methods.showPage(initialPageIndex, { animated: false });
          pageWindowElementResizeObserver.observe(pageWindowElement);
        }
      })();
    });

    onDestroy(() => {
      pageWindowElementResizeObserver.disconnect();
      progressManager.reset();
    });

    async function handlePageChange(pageIndex) {
      await methods.showPage(pageIndex, { animated: true });
    }

    // gestures
    function handleSwipeStart() {
      if (!swiping) return;
      data.durationMs = 0;
    }

    async function handleSwipeThresholdReached(event) {
      if (!swiping) return;

      await switcher({
        [NEXT]: methods.showNextPage,
        [PREV]: methods.showPrevPage,
      })(event.detail.direction);
    }

    function handleSwipeMove(event) {
      if (!swiping) return;
      data.offset += event.detail.dx;
    }

    function handleSwipeEnd() {
      if (!swiping) return;
      methods.showParticle(data.currentParticleIndex);
    }

    async function handleSwipeFailed() {
      if (!swiping) return;
      await methods.offsetPage({ animated: true });
    }

    function handleHovered(event) {
      data.focused = event.detail.value;
    }

    function handleTapped() {
      methods.toggleFocused();
    }

    function showPrevPage() {
      methods.showPrevPage();
    }

    const writable_props = [
      "timingFunction",
      "arrows",
      "infinite",
      "initialPageIndex",
      "duration",
      "autoplay",
      "autoplayDuration",
      "autoplayDirection",
      "pauseOnFocus",
      "autoplayProgressVisible",
      "dots",
      "swiping",
      "particlesToShow",
      "particlesToScroll",
    ];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Carousel> was created with unknown prop '${key}'`);
    });

    const swipeable_function = () => pageWindowWidth / 3;

    function div0_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        particlesContainer = $$value;
        $$invalidate(13, particlesContainer);
      });
    }

    function div1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        pageWindowElement = $$value;
        $$invalidate(12, pageWindowElement);
      });
    }

    const pageChange_handler = (event) => handlePageChange(event.detail);

    $$self.$$set = ($$props) => {
      if ("timingFunction" in $$props)
        $$invalidate(0, (timingFunction = $$props.timingFunction));
      if ("arrows" in $$props) $$invalidate(1, (arrows = $$props.arrows));
      if ("infinite" in $$props) $$invalidate(2, (infinite = $$props.infinite));
      if ("initialPageIndex" in $$props)
        $$invalidate(24, (initialPageIndex = $$props.initialPageIndex));
      if ("duration" in $$props)
        $$invalidate(25, (duration = $$props.duration));
      if ("autoplay" in $$props)
        $$invalidate(26, (autoplay = $$props.autoplay));
      if ("autoplayDuration" in $$props)
        $$invalidate(27, (autoplayDuration = $$props.autoplayDuration));
      if ("autoplayDirection" in $$props)
        $$invalidate(28, (autoplayDirection = $$props.autoplayDirection));
      if ("pauseOnFocus" in $$props)
        $$invalidate(29, (pauseOnFocus = $$props.pauseOnFocus));
      if ("autoplayProgressVisible" in $$props)
        $$invalidate(
          3,
          (autoplayProgressVisible = $$props.autoplayProgressVisible),
        );
      if ("dots" in $$props) $$invalidate(4, (dots = $$props.dots));
      if ("swiping" in $$props) $$invalidate(30, (swiping = $$props.swiping));
      if ("particlesToShow" in $$props)
        $$invalidate(31, (particlesToShow = $$props.particlesToShow));
      if ("particlesToScroll" in $$props)
        $$invalidate(32, (particlesToScroll = $$props.particlesToScroll));
      if ("$$scope" in $$props) $$invalidate(36, ($$scope = $$props.$$scope));
    };

    $$self.$capture_state = () => ({
      onDestroy,
      onMount,
      tick,
      createEventDispatcher,
      Dots,
      Arrow,
      Progress,
      NEXT,
      PREV,
      swipeable,
      hoverable,
      tappable,
      applyParticleSizes,
      createResizeObserver,
      getClones,
      applyClones,
      get: get$1,
      switcher,
      createCarousel,
      loaded,
      currentPageIndex,
      progressValue,
      offset,
      durationMs,
      pagesCount,
      data,
      progressManager,
      methods,
      service,
      dispatch,
      timingFunction,
      arrows,
      infinite,
      initialPageIndex,
      duration,
      autoplay,
      autoplayDuration,
      autoplayDirection,
      pauseOnFocus,
      autoplayProgressVisible,
      dots,
      swiping,
      particlesToShow,
      particlesToScroll,
      goTo,
      goToPrev,
      goToNext,
      pageWindowWidth,
      pageWindowElement,
      particlesContainer,
      pageWindowElementResizeObserver,
      addClones,
      handlePageChange,
      handleSwipeStart,
      handleSwipeThresholdReached,
      handleSwipeMove,
      handleSwipeEnd,
      handleSwipeFailed,
      handleHovered,
      handleTapped,
      showPrevPage,
    });

    $$self.$inject_state = ($$props) => {
      if ("loaded" in $$props) $$invalidate(6, (loaded = $$props.loaded));
      if ("currentPageIndex" in $$props)
        $$invalidate(5, (currentPageIndex = $$props.currentPageIndex));
      if ("progressValue" in $$props)
        $$invalidate(7, (progressValue = $$props.progressValue));
      if ("offset" in $$props) $$invalidate(8, (offset = $$props.offset));
      if ("durationMs" in $$props)
        $$invalidate(9, (durationMs = $$props.durationMs));
      if ("pagesCount" in $$props)
        $$invalidate(10, (pagesCount = $$props.pagesCount));
      if ("timingFunction" in $$props)
        $$invalidate(0, (timingFunction = $$props.timingFunction));
      if ("arrows" in $$props) $$invalidate(1, (arrows = $$props.arrows));
      if ("infinite" in $$props) $$invalidate(2, (infinite = $$props.infinite));
      if ("initialPageIndex" in $$props)
        $$invalidate(24, (initialPageIndex = $$props.initialPageIndex));
      if ("duration" in $$props)
        $$invalidate(25, (duration = $$props.duration));
      if ("autoplay" in $$props)
        $$invalidate(26, (autoplay = $$props.autoplay));
      if ("autoplayDuration" in $$props)
        $$invalidate(27, (autoplayDuration = $$props.autoplayDuration));
      if ("autoplayDirection" in $$props)
        $$invalidate(28, (autoplayDirection = $$props.autoplayDirection));
      if ("pauseOnFocus" in $$props)
        $$invalidate(29, (pauseOnFocus = $$props.pauseOnFocus));
      if ("autoplayProgressVisible" in $$props)
        $$invalidate(
          3,
          (autoplayProgressVisible = $$props.autoplayProgressVisible),
        );
      if ("dots" in $$props) $$invalidate(4, (dots = $$props.dots));
      if ("swiping" in $$props) $$invalidate(30, (swiping = $$props.swiping));
      if ("particlesToShow" in $$props)
        $$invalidate(31, (particlesToShow = $$props.particlesToShow));
      if ("particlesToScroll" in $$props)
        $$invalidate(32, (particlesToScroll = $$props.particlesToScroll));
      if ("pageWindowWidth" in $$props)
        $$invalidate(11, (pageWindowWidth = $$props.pageWindowWidth));
      if ("pageWindowElement" in $$props)
        $$invalidate(12, (pageWindowElement = $$props.pageWindowElement));
      if ("particlesContainer" in $$props)
        $$invalidate(13, (particlesContainer = $$props.particlesContainer));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    $$self.$$.update = () => {
      if ($$self.$$.dirty[0] & /*currentPageIndex*/ 32) {
        {
          dispatch("pageChange", currentPageIndex);
        }
      }

      if ($$self.$$.dirty[0] & /*infinite*/ 4) {
        {
          data.infinite = infinite;
        }
      }

      if ($$self.$$.dirty[0] & /*duration*/ 33554432) {
        {
          data.durationMsInit = duration;
        }
      }

      if ($$self.$$.dirty[0] & /*autoplay*/ 67108864) {
        {
          data.autoplay = autoplay;
        }
      }

      if ($$self.$$.dirty[0] & /*autoplayDuration*/ 134217728) {
        {
          data.autoplayDuration = autoplayDuration;
        }
      }

      if ($$self.$$.dirty[0] & /*autoplayDirection*/ 268435456) {
        {
          data.autoplayDirection = autoplayDirection;
        }
      }

      if ($$self.$$.dirty[0] & /*pauseOnFocus*/ 536870912) {
        {
          data.pauseOnFocus = pauseOnFocus;
        }
      }

      if ($$self.$$.dirty[1] & /*particlesToShow*/ 1) {
        {
          data.particlesToShowInit = particlesToShow;
        }
      }

      if ($$self.$$.dirty[1] & /*particlesToScroll*/ 2) {
        {
          data.particlesToScrollInit = particlesToScroll;
        }
      }
    };

    return [
      timingFunction,
      arrows,
      infinite,
      autoplayProgressVisible,
      dots,
      currentPageIndex,
      loaded,
      progressValue,
      offset,
      durationMs,
      pagesCount,
      pageWindowWidth,
      pageWindowElement,
      particlesContainer,
      methods,
      handlePageChange,
      handleSwipeStart,
      handleSwipeThresholdReached,
      handleSwipeMove,
      handleSwipeEnd,
      handleSwipeFailed,
      handleHovered,
      handleTapped,
      showPrevPage,
      initialPageIndex,
      duration,
      autoplay,
      autoplayDuration,
      autoplayDirection,
      pauseOnFocus,
      swiping,
      particlesToShow,
      particlesToScroll,
      goTo,
      goToPrev,
      goToNext,
      $$scope,
      slots,
      swipeable_function,
      div0_binding,
      div1_binding,
      pageChange_handler,
    ];
  }

  class Carousel extends SvelteComponentDev {
    constructor(options) {
      super(options);

      init(
        this,
        options,
        instance$9,
        create_fragment$9,
        safe_not_equal,
        {
          timingFunction: 0,
          arrows: 1,
          infinite: 2,
          initialPageIndex: 24,
          duration: 25,
          autoplay: 26,
          autoplayDuration: 27,
          autoplayDirection: 28,
          pauseOnFocus: 29,
          autoplayProgressVisible: 3,
          dots: 4,
          swiping: 30,
          particlesToShow: 31,
          particlesToScroll: 32,
          goTo: 33,
          goToPrev: 34,
          goToNext: 35,
        },
        null,
        [-1, -1],
      );

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Carousel",
        options,
        id: create_fragment$9.name,
      });
    }

    get timingFunction() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set timingFunction(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get arrows() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set arrows(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get infinite() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set infinite(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get initialPageIndex() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set initialPageIndex(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get duration() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set duration(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get autoplay() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set autoplay(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get autoplayDuration() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set autoplayDuration(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get autoplayDirection() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set autoplayDirection(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get pauseOnFocus() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set pauseOnFocus(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get autoplayProgressVisible() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set autoplayProgressVisible(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get dots() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set dots(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get swiping() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set swiping(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get particlesToShow() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set particlesToShow(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get particlesToScroll() {
      throw new Error_1(
        "<Carousel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set particlesToScroll(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get goTo() {
      return this.$$.ctx[33];
    }

    set goTo(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get goToPrev() {
      return this.$$.ctx[34];
    }

    set goToPrev(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    get goToNext() {
      return this.$$.ctx[35];
    }

    set goToNext(value) {
      throw new Error_1(
        "<Carousel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }
  }

  /* src/components/Image.svelte generated by Svelte v3.59.2 */
  const file$8 = "src/components/Image.svelte";

  // (5:18)
  function create_if_block_2(ctx) {
    let img;
    let img_src_value;

    const block = {
      c: function create() {
        img = element("img");
        if (
          !src_url_equal(
            img.src,
            (img_src_value =
              "https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif"),
          )
        )
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "Loading...");
        attr_dev(img, "class", "svelte-1l03jm");
        add_location(img, file$8, 5, 1, 181);
      },
      m: function mount(target, anchor) {
        insert_dev(target, img, anchor);
      },
      p: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(img);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_2.name,
      type: "if",
      source: "(5:18) ",
      ctx,
    });

    return block;
  }

  // (3:17)
  function create_if_block_1(ctx) {
    let img;
    let img_src_value;

    const block = {
      c: function create() {
        img = element("img");
        if (
          !src_url_equal(
            img.src,
            (img_src_value =
              "https://icon-library.com/images/not-found-icon/not-found-icon-20.jpg"),
          )
        )
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "Not Found");
        attr_dev(img, "class", "svelte-1l03jm");
        add_location(img, file$8, 3, 1, 62);
      },
      m: function mount(target, anchor) {
        insert_dev(target, img, anchor);
      },
      p: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(img);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block_1.name,
      type: "if",
      source: "(3:17) ",
      ctx,
    });

    return block;
  }

  // (1:0) {#if loaded}
  function create_if_block(ctx) {
    let img;
    let img_src_value;

    const block = {
      c: function create() {
        img = element("img");
        if (!src_url_equal(img.src, (img_src_value = /*src*/ ctx[0])))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "alt", "Document");
        attr_dev(img, "class", "svelte-1l03jm");
        add_location(img, file$8, 1, 1, 14);
      },
      m: function mount(target, anchor) {
        insert_dev(target, img, anchor);
      },
      p: function update(ctx, dirty) {
        if (
          dirty & /*src*/ 1 &&
          !src_url_equal(img.src, (img_src_value = /*src*/ ctx[0]))
        ) {
          attr_dev(img, "src", img_src_value);
        }
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(img);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_if_block.name,
      type: "if",
      source: "(1:0) {#if loaded}",
      ctx,
    });

    return block;
  }

  function create_fragment$8(ctx) {
    let if_block_anchor;

    function select_block_type(ctx, dirty) {
      if (/*loaded*/ ctx[1]) return create_if_block;
      if (/*failed*/ ctx[2]) return create_if_block_1;
      if (/*loading*/ ctx[3]) return create_if_block_2;
    }

    let current_block_type = select_block_type(ctx);
    let if_block = current_block_type && current_block_type(ctx);

    const block = {
      c: function create() {
        if (if_block) if_block.c();
        if_block_anchor = empty();
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        if (if_block) if_block.m(target, anchor);
        insert_dev(target, if_block_anchor, anchor);
      },
      p: function update(ctx, [dirty]) {
        if (
          current_block_type ===
            (current_block_type = select_block_type(ctx)) &&
          if_block
        ) {
          if_block.p(ctx, dirty);
        } else {
          if (if_block) if_block.d(1);
          if_block = current_block_type && current_block_type(ctx);

          if (if_block) {
            if_block.c();
            if_block.m(if_block_anchor.parentNode, if_block_anchor);
          }
        }
      },
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (if_block) {
          if_block.d(detaching);
        }

        if (detaching) detach_dev(if_block_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$8.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$8($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Image", slots, []);
    let { src } = $$props;
    let loaded = false;
    let failed = false;
    let loading = false;

    onMount(() => {
      const img = new Image();
      img.src = src;
      $$invalidate(3, (loading = true));

      img.onload = () => {
        $$invalidate(3, (loading = false));
        $$invalidate(1, (loaded = true));
      };

      img.onerror = () => {
        $$invalidate(3, (loading = false));
        $$invalidate(2, (failed = true));
      };
    });

    $$self.$$.on_mount.push(function () {
      if (
        src === undefined &&
        !("src" in $$props || $$self.$$.bound[$$self.$$.props["src"]])
      ) {
        console.warn("<Image> was created without expected prop 'src'");
      }
    });

    const writable_props = ["src"];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Image> was created with unknown prop '${key}'`);
    });

    $$self.$$set = ($$props) => {
      if ("src" in $$props) $$invalidate(0, (src = $$props.src));
    };

    $$self.$capture_state = () => ({ onMount, src, loaded, failed, loading });

    $$self.$inject_state = ($$props) => {
      if ("src" in $$props) $$invalidate(0, (src = $$props.src));
      if ("loaded" in $$props) $$invalidate(1, (loaded = $$props.loaded));
      if ("failed" in $$props) $$invalidate(2, (failed = $$props.failed));
      if ("loading" in $$props) $$invalidate(3, (loading = $$props.loading));
    };

    if ($$props && "$$inject" in $$props) {
      $$self.$inject_state($$props.$$inject);
    }

    return [src, loaded, failed, loading];
  }

  class Image_1 extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$8, create_fragment$8, safe_not_equal, {
        src: 0,
      });

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Image_1",
        options,
        id: create_fragment$8.name,
      });
    }

    get src() {
      throw new Error(
        "<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }

    set src(value) {
      throw new Error(
        "<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'",
      );
    }
  }

  /* src/Portfolio.svelte generated by Svelte v3.59.2 */
  const file$7 = "src/Portfolio.svelte";

  function get_each_context(ctx, list, i) {
    const child_ctx = ctx.slice();
    child_ctx[1] = list[i];
    return child_ctx;
  }

  // (22:3) {#each portfolioLinks as link}
  function create_each_block(ctx) {
    let image;
    let current;

    image = new Image_1({
      props: { src: /*link*/ ctx[1] },
      $$inline: true,
    });

    const block = {
      c: function create() {
        create_component(image.$$.fragment);
      },
      m: function mount(target, anchor) {
        mount_component(image, target, anchor);
        current = true;
      },
      p: noop,
      i: function intro(local) {
        if (current) return;
        transition_in(image.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(image.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        destroy_component(image, detaching);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_each_block.name,
      type: "each",
      source: "(22:3) {#each portfolioLinks as link}",
      ctx,
    });

    return block;
  }

  // (15:2) <Carousel    autoplay    autoplayDuration={5000}    arrows={false}    particlesToShow={1}    particlesToScroll={1}   >
  function create_default_slot(ctx) {
    let each_1_anchor;
    let current;
    let each_value = /*portfolioLinks*/ ctx[0];
    validate_each_argument(each_value);
    let each_blocks = [];

    for (let i = 0; i < each_value.length; i += 1) {
      each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    }

    const out = (i) =>
      transition_out(each_blocks[i], 1, 1, () => {
        each_blocks[i] = null;
      });

    const block = {
      c: function create() {
        for (let i = 0; i < each_blocks.length; i += 1) {
          each_blocks[i].c();
        }

        each_1_anchor = empty();
      },
      m: function mount(target, anchor) {
        for (let i = 0; i < each_blocks.length; i += 1) {
          if (each_blocks[i]) {
            each_blocks[i].m(target, anchor);
          }
        }

        insert_dev(target, each_1_anchor, anchor);
        current = true;
      },
      p: function update(ctx, dirty) {
        if (dirty & /*portfolioLinks*/ 1) {
          each_value = /*portfolioLinks*/ ctx[0];
          validate_each_argument(each_value);
          let i;

          for (i = 0; i < each_value.length; i += 1) {
            const child_ctx = get_each_context(ctx, each_value, i);

            if (each_blocks[i]) {
              each_blocks[i].p(child_ctx, dirty);
              transition_in(each_blocks[i], 1);
            } else {
              each_blocks[i] = create_each_block(child_ctx);
              each_blocks[i].c();
              transition_in(each_blocks[i], 1);
              each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
            }
          }

          group_outros();

          for (i = each_value.length; i < each_blocks.length; i += 1) {
            out(i);
          }

          check_outros();
        }
      },
      i: function intro(local) {
        if (current) return;

        for (let i = 0; i < each_value.length; i += 1) {
          transition_in(each_blocks[i]);
        }

        current = true;
      },
      o: function outro(local) {
        each_blocks = each_blocks.filter(Boolean);

        for (let i = 0; i < each_blocks.length; i += 1) {
          transition_out(each_blocks[i]);
        }

        current = false;
      },
      d: function destroy(detaching) {
        destroy_each(each_blocks, detaching);
        if (detaching) detach_dev(each_1_anchor);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_default_slot.name,
      type: "slot",
      source:
        "(15:2) <Carousel    autoplay    autoplayDuration={5000}    arrows={false}    particlesToShow={1}    particlesToScroll={1}   >",
      ctx,
    });

    return block;
  }

  function create_fragment$7(ctx) {
    let section;
    let div;
    let carousel;
    let current;

    carousel = new Carousel({
      props: {
        autoplay: true,
        autoplayDuration: 5000,
        arrows: false,
        particlesToShow: 1,
        particlesToScroll: 1,
        $$slots: { default: [create_default_slot] },
        $$scope: { ctx },
      },
      $$inline: true,
    });

    const block = {
      c: function create() {
        section = element("section");
        div = element("div");
        create_component(carousel.$$.fragment);
        attr_dev(div, "id", "carousel");
        attr_dev(div, "class", "svelte-hnyz5k");
        add_location(div, file$7, 13, 1, 389);
        attr_dev(section, "class", "hero");
        add_location(section, file$7, 12, 0, 365);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, section, anchor);
        append_dev(section, div);
        mount_component(carousel, div, null);
        current = true;
      },
      p: function update(ctx, [dirty]) {
        const carousel_changes = {};

        if (dirty & /*$$scope*/ 16) {
          carousel_changes.$$scope = { dirty, ctx };
        }

        carousel.$set(carousel_changes);
      },
      i: function intro(local) {
        if (current) return;
        transition_in(carousel.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(carousel.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(section);
        destroy_component(carousel);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$7.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$7($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Portfolio", slots, []);

    const portfolioLinks = new Array(12).fill("").map((_, idx) => {
      const offset = idx;
      const baseIdx = String(offset).padStart(3, "0");
      const baseUrl = "./assets/Portfolio/signal-2024-02-01-171154_";
      return baseUrl + baseIdx + ".jpeg";
    });

    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Portfolio> was created with unknown prop '${key}'`);
    });

    $$self.$capture_state = () => ({
      Carousel,
      Image: Image_1,
      portfolioLinks,
    });
    return [portfolioLinks];
  }

  class Portfolio extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Portfolio",
        options,
        id: create_fragment$7.name,
      });
    }
  }

  /* src/SoundcloudSVG.svelte generated by Svelte v3.59.2 */

  const file$6 = "src/SoundcloudSVG.svelte";

  function create_fragment$6(ctx) {
    let svg;
    let g;
    let path;

    const block = {
      c: function create() {
        svg = svg_element("svg");
        g = svg_element("g");
        path = svg_element("path");
        set_style(path, "fill", "#FF7700");
        attr_dev(
          path,
          "d",
          "M72.83,218.485h18.207V103.832c-6.828,1.93-12.982,5.435-18.207,10.041\r\n\t\tC72.83,113.874,72.83,218.485,72.83,218.485z M36.415,140.921v77.436l1.174,0.127h17.033v-77.682H37.589\r\n\t\tC37.589,140.803,36.415,140.921,36.415,140.921z M0,179.63c0,14.102,7.338,26.328,18.207,33.147V146.52\r\n\t\tC7.338,153.329,0,165.556,0,179.63z M109.245,218.485h18.207v-109.6c-5.444-3.396-11.607-5.635-18.207-6.5V218.485z\r\n\t\t M253.73,140.803h-10.242c0.519-3.168,0.847-6.382,0.847-9.705c0-32.182-25.245-58.264-56.388-58.264\r\n\t\tc-16.896,0-31.954,7.775-42.287,19.955v125.695h108.07c20.747,0,37.589-17.388,37.589-38.855\r\n\t\tC291.319,158.182,274.477,140.803,253.73,140.803z",
        );
        add_location(path, file$6, 3, 1, 199);
        add_location(g, file$6, 2, 0, 193);
        attr_dev(svg, "height", "96px");
        attr_dev(svg, "width", "96px");
        attr_dev(svg, "version", "1.1");
        attr_dev(svg, "id", "Layer_1");
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
        attr_dev(svg, "viewBox", "0 0 291.319 291.319");
        attr_dev(svg, "xml:space", "preserve");
        attr_dev(svg, "class", "svelte-68ut4j");
        add_location(svg, file$6, 0, 0, 0);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, svg, anchor);
        append_dev(svg, g);
        append_dev(g, path);
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(svg);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$6.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$6($$self, $$props) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("SoundcloudSVG", slots, []);
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<SoundcloudSVG> was created with unknown prop '${key}'`);
    });

    return [];
  }

  class SoundcloudSVG extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "SoundcloudSVG",
        options,
        id: create_fragment$6.name,
      });
    }
  }

  /* src/FacebookSVG.svelte generated by Svelte v3.59.2 */

  const file$5 = "src/FacebookSVG.svelte";

  function create_fragment$5(ctx) {
    let svg;
    let g;
    let path0;
    let path1;

    const block = {
      c: function create() {
        svg = svg_element("svg");
        g = svg_element("g");
        path0 = svg_element("path");
        path1 = svg_element("path");
        set_style(path0, "fill", "#3B5998");
        attr_dev(
          path0,
          "d",
          "M145.659,0c80.45,0,145.66,65.219,145.66,145.66c0,80.45-65.21,145.659-145.66,145.659\r\n\t\t\tS0,226.109,0,145.66C0,65.219,65.21,0,145.659,0z",
        );
        add_location(path0, file$5, 3, 2, 200);
        set_style(path1, "fill", "#FFFFFF");
        attr_dev(
          path1,
          "d",
          "M163.394,100.277h18.772v-27.73h-22.067v0.1c-26.738,0.947-32.218,15.977-32.701,31.763h-0.055\r\n\t\t\tv13.847h-18.207v27.156h18.207v72.793h27.439v-72.793h22.477l4.342-27.156h-26.81v-8.366\r\n\t\t\tC154.791,104.556,158.341,100.277,163.394,100.277z",
        );
        add_location(path1, file$5, 5, 2, 373);
        add_location(g, file$5, 2, 1, 193);
        attr_dev(svg, "height", "96px");
        attr_dev(svg, "width", "96px");
        attr_dev(svg, "version", "1.1");
        attr_dev(svg, "id", "Layer_1");
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
        attr_dev(svg, "viewBox", "0 0 291.319 291.319");
        attr_dev(svg, "xml:space", "preserve");
        attr_dev(svg, "class", "svelte-68ut4j");
        add_location(svg, file$5, 0, 0, 0);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, svg, anchor);
        append_dev(svg, g);
        append_dev(g, path0);
        append_dev(g, path1);
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(svg);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$5.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$5($$self, $$props) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("FacebookSVG", slots, []);
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<FacebookSVG> was created with unknown prop '${key}'`);
    });

    return [];
  }

  class FacebookSVG extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "FacebookSVG",
        options,
        id: create_fragment$5.name,
      });
    }
  }

  /* src/InstagramSVG.svelte generated by Svelte v3.59.2 */

  const file$4 = "src/InstagramSVG.svelte";

  function create_fragment$4(ctx) {
    let svg;
    let g;
    let path0;
    let path1;

    const block = {
      c: function create() {
        svg = svg_element("svg");
        g = svg_element("g");
        path0 = svg_element("path");
        path1 = svg_element("path");
        set_style(path0, "fill", "#3F729B");
        attr_dev(
          path0,
          "d",
          "M145.659,0c80.44,0,145.66,65.219,145.66,145.66S226.1,291.319,145.66,291.319S0,226.1,0,145.66\r\n\t\t\tS65.21,0,145.659,0z",
        );
        add_location(path0, file$4, 3, 2, 200);
        set_style(path1, "fill", "#FFFFFF");
        attr_dev(
          path1,
          "d",
          "M195.93,63.708H95.38c-17.47,0-31.672,14.211-31.672,31.672v100.56\r\n\t\t\tc0,17.47,14.211,31.672,31.672,31.672h100.56c17.47,0,31.672-14.211,31.672-31.672V95.38\r\n\t\t\tC227.611,77.919,213.4,63.708,195.93,63.708z M205.908,82.034l3.587-0.009v27.202l-27.402,0.091l-0.091-27.202\r\n\t\t\tC182.002,82.116,205.908,82.034,205.908,82.034z M145.66,118.239c22.732,0,27.42,21.339,27.42,27.429\r\n\t\t\tc0,15.103-12.308,27.411-27.42,27.411c-15.121,0-27.42-12.308-27.42-27.411C118.23,139.578,122.928,118.239,145.66,118.239z\r\n\t\t\tM209.65,193.955c0,8.658-7.037,15.704-15.713,15.704H97.073c-8.667,0-15.713-7.037-15.713-15.704v-66.539h22.759\r\n\t\t\tc-2.112,5.198-3.305,12.299-3.305,18.253c0,24.708,20.101,44.818,44.818,44.818s44.808-20.11,44.808-44.818\r\n\t\t\tc0-5.954-1.193-13.055-3.296-18.253h22.486v66.539L209.65,193.955z",
        );
        add_location(path1, file$4, 5, 2, 354);
        add_location(g, file$4, 2, 1, 193);
        attr_dev(svg, "height", "96px");
        attr_dev(svg, "width", "96px");
        attr_dev(svg, "version", "1.1");
        attr_dev(svg, "id", "Layer_1");
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
        attr_dev(svg, "viewBox", "0 0 291.319 291.319");
        attr_dev(svg, "xml:space", "preserve");
        attr_dev(svg, "class", "svelte-68ut4j");
        add_location(svg, file$4, 0, 0, 0);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, svg, anchor);
        append_dev(svg, g);
        append_dev(g, path0);
        append_dev(g, path1);
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(svg);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$4.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$4($$self, $$props) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("InstagramSVG", slots, []);
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<InstagramSVG> was created with unknown prop '${key}'`);
    });

    return [];
  }

  class InstagramSVG extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "InstagramSVG",
        options,
        id: create_fragment$4.name,
      });
    }
  }

  /* src/PaypalSVG.svelte generated by Svelte v3.59.2 */

  const file$3 = "src/PaypalSVG.svelte";

  function create_fragment$3(ctx) {
    let svg;
    let rect;
    let path0;
    let path1;
    let path2;

    const block = {
      c: function create() {
        svg = svg_element("svg");
        rect = svg_element("rect");
        path0 = svg_element("path");
        path1 = svg_element("path");
        path2 = svg_element("path");
        attr_dev(rect, "width", "512");
        attr_dev(rect, "height", "512");
        attr_dev(rect, "rx", "15%");
        attr_dev(rect, "fill", "#ffffff");
        add_location(rect, file$3, 2, 22, 122);
        attr_dev(path0, "fill", "#002c8a");
        attr_dev(
          path0,
          "d",
          "M377 184.8L180.7 399h-72c-5 0-9-5-8-10l48-304c1-7 7-12 14-12h122c84 3 107 46 92 112z",
        );
        add_location(path0, file$3, 5, 16, 181);
        attr_dev(path1, "fill", "#009be1");
        attr_dev(
          path1,
          "d",
          "M380.2 165c30 16 37 46 27 86-13 59-52 84-109 85l-16 1c-6 0-10 4-11 10l-13 79c-1 7-7 12-14 12h-60c-5 0-9-5-8-10l22-143c1-5 182-120 182-120z",
        );
        add_location(path1, file$3, 5, 127, 292);
        attr_dev(path2, "fill", "#001f6b");
        attr_dev(
          path2,
          "d",
          "M197 292l20-127a14 14 0 0 1 13-11h96c23 0 40 4 54 11-5 44-26 115-128 117h-44c-5 0-10 4-11 10z",
        );
        add_location(path2, file$3, 5, 292, 457);
        attr_dev(svg, "height", "96px");
        attr_dev(svg, "width", "96px");
        attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
        attr_dev(svg, "aria-label", "PayPal");
        attr_dev(svg, "role", "img");
        attr_dev(svg, "viewBox", "0 0 512 512");
        attr_dev(svg, "class", "svelte-68ut4j");
        add_location(svg, file$3, 0, 0, 0);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, svg, anchor);
        append_dev(svg, rect);
        append_dev(svg, path0);
        append_dev(svg, path1);
        append_dev(svg, path2);
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(svg);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$3.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$3($$self, $$props) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("PaypalSVG", slots, []);
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<PaypalSVG> was created with unknown prop '${key}'`);
    });

    return [];
  }

  class PaypalSVG extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "PaypalSVG",
        options,
        id: create_fragment$3.name,
      });
    }
  }

  /* src/SocialLinks.svelte generated by Svelte v3.59.2 */
  const file$2 = "src/SocialLinks.svelte";

  function create_fragment$2(ctx) {
    let section;
    let h1;
    let t1;
    let div;
    let a0;
    let instagramsvg;
    let t2;
    let a1;
    let facebooksvg;
    let t3;
    let a2;
    let soundcloudsvg;
    let t4;
    let a3;
    let paypalsvg;
    let current;
    instagramsvg = new InstagramSVG({ $$inline: true });
    facebooksvg = new FacebookSVG({ $$inline: true });
    soundcloudsvg = new SoundcloudSVG({ $$inline: true });
    paypalsvg = new PaypalSVG({ $$inline: true });

    const block = {
      c: function create() {
        section = element("section");
        h1 = element("h1");
        h1.textContent = "Social Links";
        t1 = space();
        div = element("div");
        a0 = element("a");
        create_component(instagramsvg.$$.fragment);
        t2 = space();
        a1 = element("a");
        create_component(facebooksvg.$$.fragment);
        t3 = space();
        a2 = element("a");
        create_component(soundcloudsvg.$$.fragment);
        t4 = space();
        a3 = element("a");
        create_component(paypalsvg.$$.fragment);
        attr_dev(h1, "class", "svelte-xpo61g");
        add_location(h1, file$2, 8, 1, 229);
        attr_dev(a0, "class", "social-link");
        attr_dev(a0, "href", "https://www.instagram.com/copy____cat___/");
        attr_dev(a0, "target", "_blank");
        add_location(a0, file$2, 10, 2, 278);
        attr_dev(a1, "class", "social-link");
        attr_dev(a1, "href", "https://www.facebook.com/facebo/");
        attr_dev(a1, "target", "_blank");
        add_location(a1, file$2, 13, 2, 396);
        attr_dev(a2, "class", "social-link");
        attr_dev(a2, "href", "https://soundcloud.com/capybo");
        attr_dev(a2, "target", "_blank");
        add_location(a2, file$2, 16, 2, 505);
        attr_dev(a3, "class", "social-link");
        attr_dev(a3, "href", "https://paypal.me/circlecirclestudio");
        attr_dev(a3, "target", "_blank");
        add_location(a3, file$2, 19, 2, 613);
        attr_dev(div, "id", "social-links");
        attr_dev(div, "class", "svelte-xpo61g");
        add_location(div, file$2, 9, 1, 252);
        attr_dev(section, "class", "svelte-xpo61g");
        add_location(section, file$2, 7, 0, 218);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, section, anchor);
        append_dev(section, h1);
        append_dev(section, t1);
        append_dev(section, div);
        append_dev(div, a0);
        mount_component(instagramsvg, a0, null);
        append_dev(div, t2);
        append_dev(div, a1);
        mount_component(facebooksvg, a1, null);
        append_dev(div, t3);
        append_dev(div, a2);
        mount_component(soundcloudsvg, a2, null);
        append_dev(div, t4);
        append_dev(div, a3);
        mount_component(paypalsvg, a3, null);
        current = true;
      },
      p: noop,
      i: function intro(local) {
        if (current) return;
        transition_in(instagramsvg.$$.fragment, local);
        transition_in(facebooksvg.$$.fragment, local);
        transition_in(soundcloudsvg.$$.fragment, local);
        transition_in(paypalsvg.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(instagramsvg.$$.fragment, local);
        transition_out(facebooksvg.$$.fragment, local);
        transition_out(soundcloudsvg.$$.fragment, local);
        transition_out(paypalsvg.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(section);
        destroy_component(instagramsvg);
        destroy_component(facebooksvg);
        destroy_component(soundcloudsvg);
        destroy_component(paypalsvg);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$2.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$2($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("SocialLinks", slots, []);
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<SocialLinks> was created with unknown prop '${key}'`);
    });

    $$self.$capture_state = () => ({
      SoundcloudSVG,
      FacebookSVG,
      InstagramSVG,
      PaypalSVG,
    });

    return [];
  }

  class SocialLinks extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "SocialLinks",
        options,
        id: create_fragment$2.name,
      });
    }
  }

  /* src/Description.svelte generated by Svelte v3.59.2 */

  const file$1 = "src/Description.svelte";

  function create_fragment$1(ctx) {
    let table;
    let tbody;
    let tr0;
    let td0;
    let big1;
    let big0;
    let b0;
    let br;
    let span0;
    let b1;
    let t2;
    let i;
    let t4;
    let tr1;
    let td1;
    let img;
    let img_src_value;
    let t5;
    let tr2;
    let th0;
    let a0;
    let span1;
    let t7;
    let td2;
    let t9;
    let tr3;
    let th1;
    let span2;
    let t11;
    let td3;
    let t13;
    let tr4;
    let th2;
    let a1;
    let span3;
    let t15;
    let td4;
    let t17;
    let tr5;
    let th3;
    let t19;
    let td5;
    let t21;
    let tr6;
    let th4;
    let t23;
    let td6;
    let p0;
    let t25;
    let p1;
    let t27;
    let div1;
    let div0;

    const block = {
      c: function create() {
        table = element("table");
        tbody = element("tbody");
        tr0 = element("tr");
        td0 = element("td");
        big1 = element("big");
        big0 = element("big");
        b0 = element("b");
        b0.textContent = "Copycat (Bo)";
        br = element("br");
        span0 = element("span");
        b1 = element("b");
        b1.textContent = "モノマネむすめ";
        t2 = space();
        i = element("i");
        i.textContent = "Mimic Girl";
        t4 = space();
        tr1 = element("tr");
        td1 = element("td");
        img = element("img");
        t5 = space();
        tr2 = element("tr");
        th0 = element("th");
        a0 = element("a");
        span1 = element("span");
        span1.textContent = "Gender";
        t7 = space();
        td2 = element("td");
        td2.textContent = "Female";
        t9 = space();
        tr3 = element("tr");
        th1 = element("th");
        span2 = element("span");
        span2.textContent = "Hometown";
        t11 = space();
        td3 = element("td");
        td3.textContent = "???";
        t13 = space();
        tr4 = element("tr");
        th2 = element("th");
        a1 = element("a");
        span3 = element("span");
        span3.textContent = "Region";
        t15 = space();
        td4 = element("td");
        td4.textContent = "Kanto";
        t17 = space();
        tr5 = element("tr");
        th3 = element("th");
        th3.textContent = "Generation";
        t19 = space();
        td5 = element("td");
        td5.textContent = "???";
        t21 = space();
        tr6 = element("tr");
        th4 = element("th");
        th4.textContent = "Description";
        t23 = space();
        td6 = element("td");
        p0 = element("p");
        p0.textContent =
          "Bo is a mixed media artist from New York City. Her works are based on the flow and folding of time, the forgotten feelings and thoughts of the moments gone by.";
        t25 = space();
        p1 = element("p");
        p1.textContent =
          "She draws inspiration from organic forms found within nature, in addition to the temporality of street art and the buildings they belong to.";
        t27 = space();
        div1 = element("div");
        div0 = element("div");
        add_location(b0, file$1, 3, 29, 79);
        add_location(big0, file$1, 3, 24, 74);
        add_location(big1, file$1, 3, 19, 69);
        add_location(br, file$1, 3, 60, 110);
        add_location(b1, file$1, 3, 80, 130);
        attr_dev(span0, "lang", "ja");
        add_location(span0, file$1, 3, 64, 114);
        add_location(i, file$1, 3, 102, 152);
        attr_dev(td0, "colspan", "2");
        add_location(td0, file$1, 3, 3, 53);
        set_style(tr0, "text-align", "center");
        add_location(tr0, file$1, 2, 2, 19);
        attr_dev(img, "alt", "CopycatLBo.png");
        attr_dev(img, "id", "copycat");
        if (!src_url_equal(img.src, (img_src_value = "./assets/bo.jpeg")))
          attr_dev(img, "src", img_src_value);
        attr_dev(img, "decoding", "async");
        attr_dev(img, "class", "svelte-dij2rv");
        add_location(img, file$1, 7, 4, 240);
        attr_dev(td1, "colspan", "2");
        add_location(td1, file$1, 6, 3, 219);
        set_style(tr1, "text-align", "center");
        add_location(tr1, file$1, 5, 2, 185);
        set_style(span1, "color", "#000");
        add_location(span1, file$1, 11, 114, 479);
        attr_dev(a0, "href", "/wiki/Gender");
        attr_dev(a0, "title", "Gender");
        add_location(a0, file$1, 11, 76, 441);
        attr_dev(th0, "class", "roundytl roundybl");
        set_style(th0, "text-align", "right");
        set_style(th0, "overflow", "hidden");
        add_location(th0, file$1, 11, 3, 368);
        attr_dev(td2, "class", "roundytr roundybr");
        set_style(td2, "overflow", "hidden");
        add_location(td2, file$1, 13, 3, 535);
        attr_dev(tr2, "class", "bulbapedia svelte-dij2rv");
        add_location(tr2, file$1, 10, 2, 341);
        set_style(span2, "color", "#000");
        add_location(span2, file$1, 17, 50, 690);
        set_style(th1, "text-align", "right");
        set_style(th1, "overflow", "hidden");
        add_location(th1, file$1, 17, 3, 643);
        set_style(td3, "overflow", "hidden");
        add_location(td3, file$1, 19, 3, 744);
        attr_dev(tr3, "class", "bulbapedia svelte-dij2rv");
        add_location(tr3, file$1, 16, 2, 616);
        set_style(span3, "color", "#000");
        add_location(span3, file$1, 22, 97, 913);
        attr_dev(a1, "href", "/wiki/Region");
        attr_dev(a1, "title", "Region");
        add_location(a1, file$1, 22, 59, 875);
        attr_dev(th2, "class", "");
        set_style(th2, "text-align", "right");
        set_style(th2, "overflow", "hidden");
        add_location(th2, file$1, 22, 3, 819);
        attr_dev(td4, "class", "");
        set_style(td4, "overflow", "hidden");
        add_location(td4, file$1, 24, 3, 969);
        attr_dev(tr4, "class", "bulbapedia svelte-dij2rv");
        add_location(tr4, file$1, 21, 2, 792);
        set_style(th3, "text-align", "right");
        set_style(th3, "overflow", "hidden");
        add_location(th3, file$1, 27, 3, 1055);
        set_style(td5, "overflow", "hidden");
        add_location(td5, file$1, 28, 3, 1121);
        attr_dev(tr5, "class", "bulbapedia svelte-dij2rv");
        add_location(tr5, file$1, 26, 2, 1028);
        attr_dev(th4, "class", "bulbapedia svelte-dij2rv");
        set_style(th4, "text-align", "right");
        set_style(th4, "overflow", "hidden");
        add_location(th4, file$1, 31, 3, 1179);
        add_location(p0, file$1, 34, 4, 1313);
        add_location(p1, file$1, 35, 4, 1484);
        attr_dev(td6, "id", "copy");
        set_style(td6, "overflow", "hidden");
        add_location(td6, file$1, 33, 3, 1269);
        add_location(tr6, file$1, 30, 2, 1171);
        add_location(tbody, file$1, 1, 1, 9);
        attr_dev(table, "class", "svelte-dij2rv");
        add_location(table, file$1, 0, 0, 0);
        attr_dev(div0, "class", "text-tile");
        add_location(div0, file$1, 40, 2, 1701);
        attr_dev(div1, "id", "description-section");
        add_location(div1, file$1, 39, 1, 1668);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, table, anchor);
        append_dev(table, tbody);
        append_dev(tbody, tr0);
        append_dev(tr0, td0);
        append_dev(td0, big1);
        append_dev(big1, big0);
        append_dev(big0, b0);
        append_dev(td0, br);
        append_dev(td0, span0);
        append_dev(span0, b1);
        append_dev(td0, t2);
        append_dev(td0, i);
        append_dev(tbody, t4);
        append_dev(tbody, tr1);
        append_dev(tr1, td1);
        append_dev(td1, img);
        append_dev(tbody, t5);
        append_dev(tbody, tr2);
        append_dev(tr2, th0);
        append_dev(th0, a0);
        append_dev(a0, span1);
        append_dev(tr2, t7);
        append_dev(tr2, td2);
        append_dev(tbody, t9);
        append_dev(tbody, tr3);
        append_dev(tr3, th1);
        append_dev(th1, span2);
        append_dev(tr3, t11);
        append_dev(tr3, td3);
        append_dev(tbody, t13);
        append_dev(tbody, tr4);
        append_dev(tr4, th2);
        append_dev(th2, a1);
        append_dev(a1, span3);
        append_dev(tr4, t15);
        append_dev(tr4, td4);
        append_dev(tbody, t17);
        append_dev(tbody, tr5);
        append_dev(tr5, th3);
        append_dev(tr5, t19);
        append_dev(tr5, td5);
        append_dev(tbody, t21);
        append_dev(tbody, tr6);
        append_dev(tr6, th4);
        append_dev(tr6, t23);
        append_dev(tr6, td6);
        append_dev(td6, p0);
        append_dev(td6, t25);
        append_dev(td6, p1);
        insert_dev(target, t27, anchor);
        insert_dev(target, div1, anchor);
        append_dev(div1, div0);
      },
      p: noop,
      i: noop,
      o: noop,
      d: function destroy(detaching) {
        if (detaching) detach_dev(table);
        if (detaching) detach_dev(t27);
        if (detaching) detach_dev(div1);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment$1.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance$1($$self, $$props) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("Description", slots, []);
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<Description> was created with unknown prop '${key}'`);
    });

    return [];
  }

  class Description extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "Description",
        options,
        id: create_fragment$1.name,
      });
    }
  }

  /* src/App.svelte generated by Svelte v3.59.2 */
  const file = "src/App.svelte";

  function create_fragment(ctx) {
    let header;
    let h1;
    let t1;
    let main;
    let section0;
    let portfolio;
    let t2;
    let sociallinks;
    let t3;
    let section1;
    let description;
    let t4;
    let footer;
    let span;
    let t5;
    let a;
    let t7;
    let current;
    portfolio = new Portfolio({ $$inline: true });
    sociallinks = new SocialLinks({ $$inline: true });
    description = new Description({ $$inline: true });

    const block = {
      c: function create() {
        header = element("header");
        h1 = element("h1");
        h1.textContent = "circlecircle.studio";
        t1 = space();
        main = element("main");
        section0 = element("section");
        create_component(portfolio.$$.fragment);
        t2 = space();
        create_component(sociallinks.$$.fragment);
        t3 = space();
        section1 = element("section");
        create_component(description.$$.fragment);
        t4 = space();
        footer = element("footer");
        span = element("span");
        t5 = text("Built by ");
        a = element("a");
        a.textContent = "[Syncretik]";
        t7 = text(" 2024, All Rights Reserved.");
        add_location(h1, file, 6, 1, 172);
        add_location(header, file, 5, 0, 162);
        attr_dev(section0, "id", "left-half");
        add_location(section0, file, 9, 1, 219);
        attr_dev(section1, "id", "right-half");
        add_location(section1, file, 13, 1, 291);
        attr_dev(main, "class", "svelte-1txh1g6");
        add_location(main, file, 8, 0, 211);
        attr_dev(a, "href", "https://syncretik.co");
        attr_dev(a, "class", "svelte-1txh1g6");
        add_location(a, file, 18, 16, 380);
        add_location(span, file, 18, 1, 365);
        attr_dev(footer, "class", "svelte-1txh1g6");
        add_location(footer, file, 17, 0, 355);
      },
      l: function claim(nodes) {
        throw new Error(
          "options.hydrate only works if the component was compiled with the `hydratable: true` option",
        );
      },
      m: function mount(target, anchor) {
        insert_dev(target, header, anchor);
        append_dev(header, h1);
        insert_dev(target, t1, anchor);
        insert_dev(target, main, anchor);
        append_dev(main, section0);
        mount_component(portfolio, section0, null);
        append_dev(section0, t2);
        mount_component(sociallinks, section0, null);
        append_dev(main, t3);
        append_dev(main, section1);
        mount_component(description, section1, null);
        insert_dev(target, t4, anchor);
        insert_dev(target, footer, anchor);
        append_dev(footer, span);
        append_dev(span, t5);
        append_dev(span, a);
        append_dev(span, t7);
        current = true;
      },
      p: noop,
      i: function intro(local) {
        if (current) return;
        transition_in(portfolio.$$.fragment, local);
        transition_in(sociallinks.$$.fragment, local);
        transition_in(description.$$.fragment, local);
        current = true;
      },
      o: function outro(local) {
        transition_out(portfolio.$$.fragment, local);
        transition_out(sociallinks.$$.fragment, local);
        transition_out(description.$$.fragment, local);
        current = false;
      },
      d: function destroy(detaching) {
        if (detaching) detach_dev(header);
        if (detaching) detach_dev(t1);
        if (detaching) detach_dev(main);
        destroy_component(portfolio);
        destroy_component(sociallinks);
        destroy_component(description);
        if (detaching) detach_dev(t4);
        if (detaching) detach_dev(footer);
      },
    };

    dispatch_dev("SvelteRegisterBlock", {
      block,
      id: create_fragment.name,
      type: "component",
      source: "",
      ctx,
    });

    return block;
  }

  function instance($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    validate_slots("App", slots, []);
    const writable_props = [];

    Object.keys($$props).forEach((key) => {
      if (
        !~writable_props.indexOf(key) &&
        key.slice(0, 2) !== "$$" &&
        key !== "slot"
      )
        console.warn(`<App> was created with unknown prop '${key}'`);
    });

    $$self.$capture_state = () => ({ Portfolio, SocialLinks, Description });
    return [];
  }

  class App extends SvelteComponentDev {
    constructor(options) {
      super(options);
      init(this, options, instance, create_fragment, safe_not_equal, {});

      dispatch_dev("SvelteRegisterComponent", {
        component: this,
        tagName: "App",
        options,
        id: create_fragment.name,
      });
    }
  }

  const app = new App({
    target: document.body,
  });

  return app;
})();
//# sourceMappingURL=bundle.js.map
