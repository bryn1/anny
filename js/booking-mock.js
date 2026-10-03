/* booking-mock.js — one concern: the "Boka tid" DEMO calendar + honest flow.
 * Reuses the Hotell booking-calendar pattern (.tmp/hotell-ref, read-only):
 * ONE .cal-grid whose template lives ONLY in components.css (I3); header/body/
 * rows join via display:contents; mobile adapts through the .cal-wrap scroll
 * wrapper — this script never touches grid tracks. Flow (booking-flow.js:362
 * pattern): select slot -> confirm modal -> done view that states truthfully
 * that real booking goes via telefon/Instagram. It NEVER books anything (I2).
 * Availability below is a fixed DEMO pattern (static placeholder data), not
 * real opening hours — those are pending owner confirmation (I1). */
(function () {
  'use strict';

  var host = document.querySelector('[data-calendar-root]');
  var dialog = document.getElementById('booking-dialog');
  if (!host || !dialog || typeof dialog.showModal !== 'function') return;

  var DAYS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'];
  var SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  /* Fixed demo availability (row = slot, col = day). true = demo-ledig. */
  var FREE = [
    [true,  true,  false, true,  true],
    [false, true,  true,  true,  false],
    [true,  false, true,  true,  true],
    [true,  true,  true,  false, true],
    [false, false, true,  true,  true],
    [true,  true,  false, true,  false],
    [true,  false, true,  true,  true],
    [false, true,  true,  false, true]
  ];

  var slotLabel = document.querySelector('[data-dialog-slot]');
  var views = {
    confirm: dialog.querySelector('[data-dialog-view="confirm"]'),
    done: dialog.querySelector('[data-dialog-view="done"]')
  };
  var selected = null;

  function buildGrid() {
    var grid = document.createElement('div');
    grid.className = 'cal-grid';

    var head = document.createElement('div');
    head.className = 'cal-grid__head';
    var corner = document.createElement('div');
    corner.className = 'cal-grid__corner';
    corner.textContent = 'Klockan';
    head.appendChild(corner);
    DAYS.forEach(function (d) {
      var cell = document.createElement('div');
      cell.className = 'cal-grid__day';
      cell.textContent = d;
      head.appendChild(cell);
    });
    grid.appendChild(head);

    var body = document.createElement('div');
    body.className = 'cal-grid__body';

    SLOTS.forEach(function (time, r) {
      var row = document.createElement('div');
      row.className = 'cal-grid__row';

      var label = document.createElement('div');
      label.className = 'cal-grid__slot-label';
      label.textContent = time;
      row.appendChild(label);

      DAYS.forEach(function (day, c) {
        var free = FREE[r][c];
        var cell = document.createElement(free ? 'button' : 'span');
        cell.className = 'cal-grid__cell ' +
          (free ? 'cal-grid__cell--free' : 'cal-grid__cell--taken');
        cell.textContent = free ? 'Demo-ledig' : 'Demo-upptagen';
        if (free) {
          cell.type = 'button';
          cell.setAttribute('aria-label',
            day + ' ' + time + ' — demo-ledig, välj tid för att se hur bokning går till');
          cell.dataset.slotDay = day;
          cell.dataset.slotTime = time;
          cell.addEventListener('click', function () { select(cell); });
        } else {
          cell.setAttribute('aria-label', day + ' ' + time + ' — demo-upptagen');
        }
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
    grid.appendChild(body);
    host.appendChild(grid);
  }

  function clearSelection() {
    if (!selected) return;
    selected.removeAttribute('aria-pressed');
    selected = null;
  }

  function showView(name) {
    Object.keys(views).forEach(function (key) {
      if (views[key]) views[key].hidden = key !== name;
    });
  }

  function select(cell) {
    clearSelection();
    selected = cell;
    cell.setAttribute('aria-pressed', 'true');
    slotLabel.textContent = cell.dataset.slotDay + ' kl ' + cell.dataset.slotTime;
    showView('confirm');
    dialog.showModal();
  }

  function close() {
    dialog.close();
  }

  var confirmBtn = dialog.querySelector('[data-dialog-confirm]');
  if (confirmBtn) confirmBtn.addEventListener('click', function () {
    showView('done');
    var first = views.done && views.done.querySelector('button, a');
    if (first) first.focus();
  });

  dialog.querySelectorAll('[data-dialog-close]').forEach(function (btn) {
    btn.addEventListener('click', close);
  });

  /* Reset the dialog after ANY close path (buttons, Esc, backdrop-less native
   * close): back to the confirm view, selection cleared. Native <dialog>
   * returns focus to the slot button that opened it (I5). */
  dialog.addEventListener('close', function () {
    showView('confirm');
    clearSelection();
  });

  buildGrid();
})();
