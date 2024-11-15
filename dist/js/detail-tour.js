$(document).ready(function () {
  function setupDateRangePicker() {
    var inputOffset = $('#change-date').offset().top
    var inputHeight = $('#change-date').outerHeight()
    var scrollTop = $(window).scrollTop()
    var viewportHeight = $(window).height()
    var pickerHeight = 250 // Chiều cao ước tính của picker (có thể điều chỉnh)

    // Kiểm tra nếu có đủ không gian bên dưới, nếu không mở lên trên
    var drops =
      inputOffset - scrollTop + inputHeight + pickerHeight > viewportHeight
        ? 'up'
        : 'down'

    // Khởi tạo `daterangepicker` với `drops` theo vị trí
    $('#change-date').daterangepicker(
      {
        singleDatePicker: true,
        showDropdowns: false,
        minYear: 1901,
        maxYear: parseInt(moment().format('YYYY'), 10),
        autoApply: true,
        drops: drops,
        opens: 'left',
        locale: {
          format: 'DD-MM-YYYY',
        },
      },
      function (start, end, label) {
        var years = moment().diff(start, 'years')
        alert('You are ' + years + ' years old!')
      }
    )
  }

  // Thiết lập picker khi trang đã tải
  setupDateRangePicker()

  // Gỡ bỏ picker và thiết lập lại khi hiển thị để cập nhật vị trí động
  $('#change-date').on('show.daterangepicker', function (ev, picker) {
    picker.remove()
    setupDateRangePicker()
  })
  $(window).on('scroll', function () {
    $('#change-date').data('daterangepicker').remove() // Gỡ bỏ picker
    setupDateRangePicker() // Thiết lập lại picker với vị trí mới
  })

  $('.other-tour__carousel').owlCarousel({
    autoplay: true,
    loop: true,
    nav: false,
    margin: 0,
    dots: false,
    freeDrag: false,
    autoplayTimeout: 5000,
    margin: 32,
    responsive: {
      0: {
        items: 1,
        stagePadding: 30,
        margin: 16,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 2,
      },
      1024: {
        items: 3,
      },
    },
  })
  $('.owl-carousel').on('mousedown touchstart', function (e) {
    const start = e.pageX || e.originalEvent.touches[0].pageX

    $(this).on('mousemove touchmove', function (e) {
      const end = e.pageX || e.originalEvent.touches[0].pageX
      if (start - end > 50) {
        // Threshold for dragging to next slide
        $(this).trigger('next.owl.carousel')
        $(this).off('mousemove touchmove') // Unbind after trigger
      }
    })

    // Unbind the move event if dragging doesn't reach the threshold
    $(this).on('mouseup touchend', function () {
      $(this).off('mousemove touchmove')
    })
  })

  $('.list-thumb__item').on('click', function () {
    $('#modalImages').modal('show')
  })
  $('.images__primary').on('click', function () {
    $('#modalImages').modal('show')
  })
  $('#close-modal').on('click', function () {
    $('#modalImages').modal('hide')
  })
})
