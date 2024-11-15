$(document).ready(function () {
  // Select
  $('#sort-tour').vSelect({
    multiSelect: false,
    display: 'values',
    search: false,
    searchPosition: -1,
  })
  $('#location-start').vSelect({
    multiSelect: false,
    display: 'values',
    search: true,
    searchPosition: -1,
  })
  $('#location-target').vSelect({
    multiSelect: false,
    display: 'values',
    search: true,
    searchPosition: -1,
  })
  $('#location-start-tablet').vSelect({
    multiSelect: false,
    display: 'values',
    search: true,
    searchPosition: -1,
  })
  $('#location-target-tablet').vSelect({
    multiSelect: false,
    display: 'values',
    search: true,
    searchPosition: -1,
  })
  $('input[name="filter-start-date"]').daterangepicker(
    {
      singleDatePicker: true,
      showDropdowns: false,
      minYear: 1901,
      maxYear: parseInt(moment().format('YYYY'), 10),
      autoApply: true,
      locale: {
        format: 'DD-MM-YYYY',
      },
    },
    function (start, end, label) {
      var years = moment().diff(start, 'years')
      alert('You are ' + years + ' years old!')
    }
  )
  // Khi nhấn vào label-item, tìm phần tử cha .filter-tablet__content và hiển thị nó
  $('#filter-tablet').on('click', function () {
    $(this).children('.filter-tablet__content').addClass('active')
  })

  // Khi nhấn vào nút đóng, tìm phần tử cha .filter-tablet__content và ẩn nó
  $('#filter-tablet .close').on('click', function (e) {
    e.stopPropagation()
    $(this).parents('.filter-tablet__content').removeClass('active')
  })
  $('#sort-tablet').on('click', function () {
    $(this).children('.filter-tablet__content').addClass('active')
  })

  // Khi nhấn vào nút đóng, tìm phần tử cha .filter-tablet__content và ẩn nó
  $('#sort-tablet .close').on('click', function (e) {
    e.stopPropagation()
    $(this).parents('.filter-tablet__content').removeClass('active')
  })
})
