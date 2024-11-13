$.fn.vSelect = function (s) {
  let vSelectElms = []

  function init(sElm, s) {
    // Default settings
    let settings = {
      multiSelect: true,
      placeholder: 'Please select',
      checkAll: true,
      checkAllLabel: 'All',
      expanded: true,
      display: 'sum', // sum, values
      trayHeight: '240px', // auto, ###px
      dropdown: true, // fixed
      search: false,
      searchPosition: -1, // -1, 0, #, ##
      onChange: function (values, options) {},
    }

    let checkAllElm

    // Process user's settings
    if (s !== null) {
      $.each(s, function (key, value) {
        settings[key] = value
      })
    }

    // Original select element
    const selectElm = sElm
    selectElm.hide()

    // Create a random id
    const randomId =
      '-' +
      Math.floor(Math.random() * 1000) +
      '-' +
      Math.floor(Math.random() * 1000)

    let options = []
    let preSelectedOptions = []

    // Process and store all options
    selectElm.children().each(function (index) {
      const elm = $(this)
      const preSelected = !!elm.attr('selected')

      if (preSelected) {
        if (elm[0].nodeName === 'OPTION') {
          preSelectedOptions.push(elm.attr('value'))
        } else {
          preSelectedOptions.push(elm.attr('label'))
        }
      }

      if (elm[0].nodeName === 'OPTION') {
        options.push({
          type: 'option',
          value: elm.val(),
          label: elm.text(),
          checked: false,
          class: elm.attr('class'),
          disabled: elm.attr('disabled'),
        })
      } else if (elm[0].nodeName === 'OPTGROUP') {
        let temp = []

        elm.children().each(function (index) {
          const cElm = $(this)
          const preSelectedC = !!cElm.attr('selected')

          if (preSelectedC) {
            preSelectedOptions.push(cElm.attr('value'))
          }

          temp.push({
            type: 'option',
            value: cElm.val(),
            label: cElm.text(),
            checked: false,
            class: elm.attr('class'),
            disabled: elm.attr('disabled'),
          })
        })

        options.push({
          type: 'optgroup',
          value: 0,
          label: elm.attr('label'),
          options: temp,
          checked: false,
        })
      }
    })

    // Reset all values in options to true or false
    function resetOptionsVariable(checked) {
      options.map((x, index) => {
        if (x.type === 'option') {
          x.checked = checked
        } else {
          x.options.map((y, index) => {
            y.checked = checked
          })
        }
      })
    }

    // Create vSelect element
    const vSelectElm = $('<div></div>').insertAfter(selectElm)
    // Add a container class
    vSelectElm.addClass(
      'vselect-container ' +
        (settings.multiSelect ? 'multi-select' : 'single-select')
    )
    // Add a random id
    vSelectElm.attr('id', 'vselect' + randomId)
    // Append a div to display selected options
    const vSelectDisplay = $(
      '<div class="vselect-display-container vselect-tray-toggle" data-target="#vselect-tray' +
        randomId +
        '"><div class="vselect-selected-display"><span class="vselect-display-text">' +
        settings.placeholder +
        '</span></div><div class="vselect-collapse-toggle"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#202020" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></div>'
    )
    vSelectElm.append(vSelectDisplay)

    const vSelectTrayContainer = $('<div class="vselect-tray-container"></div>')
    // Append tray container
    vSelectElm.append(vSelectTrayContainer)
    const vSelectTray = $(
      '<div class="vselect-tray ' +
        (settings.dropdown ? 'dropdown' : '') +
        '" id="vselect-tray' +
        randomId +
        '" style="height: ' +
        settings.trayHeight +
        '"></div>'
    )
    // Append options tray
    vSelectTrayContainer.append(vSelectTray)

    hideTray(vSelectTray)

    vSelectElm.find('.vselect-tray-toggle').on('click', function () {
      const toggleElm = $(this)
      const target = toggleElm.data('target')

      if (toggleElm.hasClass('active')) {
        toggleElm.removeClass('active')
        hideTray($(target))
      } else {
        toggleElm.addClass('active')
        showTray($(target))
      }
    })

    if (settings.multiSelect && settings.checkAll) {
      checkAllElm = $(
        '<div class="vselect-global"><input type="checkbox" id="vselect-global' +
          randomId +
          '" data-type="all"><label for="vselect-global' +
          randomId +
          '" class="" for="vselect-global">' +
          settings.checkAllLabel +
          '</label></div>'
      )
      // Append Global checkbox (select all)
      vSelectTray.append(checkAllElm)

      // Check all checkbox handler
      checkAllElm.find('input[type=checkbox]').on('change', function () {
        const elm = $(this)
        const checked = elm.is(':checked')

        vSelectElm
          .find('.vselect-option input[type=checkbox]')
          .prop('checked', checked)
        selectElm.find('option').prop('selected', checked)

        resetOptionsVariable(checked)
        updateDisplay()
      })
    }

    // Append checkbox for option or child option of an optgroup
    function addOption(item, index, idx = null, group = false) {
      const optElm = $(
        '<div><input type="checkbox" id="vselect-option-' +
          (group
            ? group + '-' + (idx === null ? index : index + '-' + idx)
            : index + randomId) +
          '" value="' +
          item.value +
          '" data-index="' +
          (idx === null ? index : index + '-' + idx) +
          '"><label for="vselect-option-' +
          (group
            ? group + '-' + (idx === null ? index : index + '-' + idx)
            : index + randomId) +
          '">' +
          item.label +
          '</label></div>'
      )

      vSelectTray.append(optElm)

      if (item.class !== undefined) {
        optElm.addClass(item.class)
      }

      if (item.disabled === 'disabled') {
        optElm.find('input[type=checkbox]').attr('disabled', 'true')
        optElm.css('pointer-events', 'none')
        optElm.addClass('vselect-option-disabled')
      }

      optElm.addClass('vselect-option')
      optElm.addClass(
        (group ? 'vselect-option-child ' : '') + (group ? group : '')
      )

      if (!group) {
        optElm.addClass('vselect-option-solo')
      } else if (!settings.expanded) {
        optElm.hide()
      }

      if (idx === null) {
        optElm.find('input[type=checkbox]').attr('data-type', 'solo')
      } else {
        optElm.find('input[type=checkbox]').attr('data-type', 'child')
        optElm.find('input[type=checkbox]').attr('data-group-id', group)
        optElm.find('input[type=checkbox]').addClass('vselect-child-' + group)
      }

      if (!settings.multiSelect) {
        optElm.find('input[type=checkbox]').hide()
      }
    }

    // Append checkbox for an optgroup
    function addOptgroup(item, index, group) {
      let ogElm

      if (settings.multiSelect) {
        ogElm = $(
          '<div><input type="checkbox" value="' +
            item.label +
            '" id="vselect-group-' +
            group +
            '" data-group-id="' +
            group +
            '" data-index="' +
            index +
            '"><label for="vselect-group-' +
            group +
            '">' +
            item.label +
            '</label><div data-group-id="' +
            group +
            '" class="vselect-collapse-toggle vselect-group-toggle"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#202020" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>'
        )

        vSelectTray.append(ogElm)

        ogElm.find('input[type=checkbox]').attr('data-type', 'group')
      } else {
        ogElm = $(
          '<div><label class="vselect-group-label">' +
            item.label +
            '</label><div data-group-id="' +
            group +
            '" class="vselect-collapse-toggle vselect-group-toggle"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#202020" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>'
        )

        vSelectTray.append(ogElm)
      }

      ogElm.addClass('vselect-option')
      ogElm.addClass('vselect-option-group')

      if (settings.expanded) {
        ogElm.find('.vselect-group-toggle').addClass('active')
      }
    }

    // Loop options to append all checkboxes
    $.each(options, function (index) {
      const item = $(this)[0]

      if (item.type === 'option') {
        addOption(item, index)
      }

      if (item.type === 'optgroup') {
        const group =
          item.label
            .toLowerCase()
            .replace(/ /g, '_')
            .replace(/[^\w\s]/gi, '') + randomId
        addOptgroup(item, index, group)

        $.each(item.options, function (idx) {
          const childItem = $(this)[0]

          addOption(childItem, index, idx, group)
        })
      }
    })

    const vSelectOptions = vSelectElm.find('.vselect-option') // All options checkboxes
    const vSelectGroup = vSelectElm.find('.vselect-option-group') // Only group options checkboxes

    // Group toggle to show/hide child options
    vSelectGroup.find('.vselect-group-toggle').on('click', function () {
      const toggleElm = $(this)
      const groupId = toggleElm.data('group-id')

      if (toggleElm.hasClass('active')) {
        toggleElm.removeClass('active')
        vSelectElm.find('.vselect-option-child.' + groupId).hide()
      } else {
        toggleElm.addClass('active')
        vSelectElm.find('.vselect-option-child.' + groupId).show()
      }
    })

    function updateOptionsVariable(elm, checked) {
      const type = elm.data('type')
      let index
      let data

      if (type === 'child') {
        index = elm.data('index').split('-')
        data = options[parseInt(index[0])].options[parseInt(index[1])]
      } else {
        index = elm.data('index')
        data = options[index]
      }

      data.checked = checked

      updateSelectElm(data)

      settings.onChange(data, options)
    }

    // Checkbox on change handler ///////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////////////////////////////
    vSelectOptions.find('input[type=checkbox]').on('change', function (e) {
      const cbElm = $(this)
      const checked = cbElm.is(':checked')

      if (!settings.multiSelect) {
        hideTray(vSelectTray)
        vSelectElm.find('.vselect-tray-toggle').removeClass('active')
      }

      // If single selection only and checked on already checked option, the option will turned to false
      if (!settings.multiSelect && !checked) {
        e.preventDefault()

        // Set it back to true
        cbElm.prop('checked', true)
        return
      }

      const type = cbElm.data('type')

      // If not multiSelect, uncheck all other options
      if (!settings.multiSelect) {
        // Reset all checked state in options variable to false
        resetOptionsVariable(false)
        vSelectOptions
          .find('input[type=checkbox]')
          .not(cbElm)
          .each(function () {
            $(this).prop('checked', false)
          })
        vSelectOptions
          .find('input[type=checkbox]')
          .parent()
          .removeClass('active')
        cbElm.parent().addClass('active')
      }

      switch (type) {
        case 'solo':
          // Do nothing...

          break

        case 'group':
          checkUncheckAllChilds(cbElm, checked)

          break

        case 'child':
          if (settings.multiSelect) {
            isAllChildChecked(cbElm)
          }

          break
      }

      if (settings.multiSelect && settings.checkAll) {
        isAllOptionsChecked()
      }

      updateOptionsVariable(cbElm, checked)

      updateDisplay()
    })

    // Update option of original Select element
    function updateSelectElm(data) {
      // If not multiSelect, uncheck all other options
      if (!settings.multiSelect && data.checked) {
        selectElm.find('option').prop('selected', false)
      }

      selectElm
        .find('option[value="' + data.value + '"]')
        .prop('selected', data.checked)
    }

    // Check if is all children of the group is checked
    function isAllChildChecked(cbElm) {
      const groupId = cbElm.data('group-id')
      const groundChilds = vSelectElm.find(
        '.vselect-option-child.' + groupId + ' input[type=checkbox]'
      )

      let allChecked = true

      groundChilds.each(function () {
        const cElm = $(this)

        const checked = cElm.is(':checked')

        if (!checked) {
          allChecked = checked
        }
      })

      if (allChecked) {
        vSelectElm.find('#vselect-group-' + groupId).prop('checked', true)
      } else {
        vSelectElm.find('#vselect-group-' + groupId).prop('checked', false)
      }
    }

    // Check or unchcked all children in the group
    function checkUncheckAllChilds(cbElm, checked) {
      const groupId = cbElm.data('group-id')

      vSelectElm.find('.vselect-child-' + groupId).prop('checked', checked)

      vSelectElm.find('.vselect-child-' + groupId).each(function () {
        const cElm = $(this)
        const val = cElm.val()

        selectElm.find('option[value=' + val + ']').prop('selected', checked)

        updateOptionsVariable(cElm, checked)
      })

      updateDisplay()
    }

    // Check if is every options is checked or unchecked
    function isAllOptionsChecked() {
      const optionsCbElms = vSelectElm.find(
        '.vselect-option input[type=checkbox]'
      )

      let allChecked = true

      optionsCbElms.each(function () {
        const cElm = $(this)

        const checked = cElm.is(':checked')

        if (!checked) {
          allChecked = checked
        }
      })

      if (allChecked) {
        $('#vselect-global' + randomId).prop('checked', true)
      } else {
        $('#vselect-global' + randomId).prop('checked', false)
      }
    }

    // Update display with selected values
    function updateDisplay() {
      let checkedOptions = []

      options.map((option, index) => {
        if (option.type === 'option') {
          if (option.type === 'option' && option.checked) {
            checkedOptions.push(option)
          }
        } else {
          const temp = option.options.map((childOption, index) => {
            if (childOption.type === 'option' && childOption.checked) {
              checkedOptions.push(childOption)
            }
          })
        }
      })

      if (checkedOptions.length > 0) {
        if (settings.display === 'sum') {
          vSelectElm
            .find('.vselect-display-text')
            .text(checkedOptions.length + ' option(s) selected')
        } else {
          // settings.display = 'values'
          let temp = []

          checkedOptions.map((x, index) => {
            temp.push(x.label)
          })

          vSelectElm.find('.vselect-display-text').text(temp.join('; '))
        }
      } else {
        vSelectElm.find('.vselect-display-text').text(settings.placeholder)
      }
    }

    // Enable search box
    if (s.search) {
      const vSelectSearchBox = $(
        '<div class="vselect-search-box" style="display: none;"></div>'
      )
      vSelectElm.find('.vselect-display-container').append(vSelectSearchBox)

      const vSelectSearchInput = $(
        '<input type="text" placeholder="Search" class="vselect-search-input" />'
      )
      vSelectSearchBox.append(vSelectSearchInput)

      // Handling search
      vSelectSearchInput.on('keyup', function (key) {
        var value = $(this).val().toLowerCase()

        if (value === '') {
          return
        }

        vSelectElm.find('.vselect-option').filter(function () {
          if (s.searchPosition > 0) {
            $(this).toggle(
              $(this).find('label').text().toLowerCase().indexOf(value) >=
                s.searchPosition
            )
          } else if (s.searchPosition === 0) {
            $(this).toggle(
              $(this).find('label').text().toLowerCase().indexOf(value) === 0
            )
          } else {
            $(this).toggle(
              $(this).find('label').text().toLowerCase().indexOf(value) > -1
            )
          }
        })
      })

      vSelectSearchInput.on('click', function (e) {
        e.stopPropagation()
      })
    }

    // Hide dropdown tray
    function showTray(tray) {
      tray.show()
      if (s.search) {
        vSelectElm.find('.vselect-search-box').show()

        vSelectElm.find('.vselect-search-input').val('')
        vSelectElm.find('.vselect-search-input').trigger('keyup')
        vSelectElm.find('.vselect-search-input').trigger('focus')
      }
    }

    // Hide dropdown tray
    function hideTray(tray) {
      tray.hide()
      if (s.search) {
        vSelectElm.find('.vselect-search-box').hide()
      }
    }

    // Preselect options
    if (preSelectedOptions.length > 0) {
      preSelectedOptions.map((option, index) => {
        const elm = vSelectElm.find(
          '.vselect-option input[type="checkbox"][value="' + option + '"]'
        )

        elm.prop('checked', true)
        elm.trigger('change')
      })
    }

    // Hide dropdown tray when user clicked outside of vSelect
    $(document).on('click', function (event) {
      var target = $(event.target)
      if (
        !target.is('#vselect' + randomId) &&
        !target.closest('#vselect' + randomId).length
      ) {
        hideTray(vSelectTray)
        vSelectElm.find('.vselect-tray-toggle').removeClass('active')
      }
    })

    function resetOptions() {
      const checked = false

      vSelectElm
        .find('.vselect-option input[type=checkbox]')
        .prop('checked', checked)
      selectElm.find('option').prop('selected', checked)

      resetOptionsVariable(checked)
      updateDisplay()
    }

    return {
      resetOptions: resetOptions,
    }
  }

  // Return elements to jQuery
  $(this).each(function () {
    const instance = init($(this), s)
    $(this).data('vSelect', instance)
  })

  return this
}
