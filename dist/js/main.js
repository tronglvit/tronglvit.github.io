$(document).ready(function () {
  // dropdown
  $(document).click(function (event) {
    if (!$(event.target).closest('.dropdown').length) {
      $('.dropdown').removeClass('active') // Bỏ class 'active' nếu click bên ngoài
    }
  })
  $('.dropdown .dropdown__selector').click(function (e) {
    e.stopPropagation()
    $('.dropdown').not($(this).parent()).removeClass('active')
    $(this).parents('.dropdown').toggleClass('active')
    const dropdownMenu = $(this).siblings('.dropdown__popover')
    const parentWidth = $(this).outerWidth() // Lấy chiều rộng của phần tử cha
    const offset = this.getBoundingClientRect()
    dropdownMenu.css({
      top: offset.top + $(this).outerHeight(), // Đặt menu ngay dưới nút
      left: offset.left, // Căn trái theo nút
      width: parentWidth, // Đặt chiều rộng của menu bằng chiều rộng của nút
    })
  })

  // Carousel
  $('.home-banner-primary').owlCarousel({
    autoplay: true,
    loop: true,
    nav: false,
    margin: 0,
    dots: false,
    freeDrag: false,
    autoplayTimeout: 10000,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  })
  const carouselHomeExplore = $('.home-explore__carousel')
  const carouselHomeLastHour = $('.home-lasthour__carousel')
  $('.home-group-tour__carousel').owlCarousel({
    autoplay: true,
    loop: true,
    nav: false,
    dots: true,
    freeDrag: false,
    autoApply: true,
    margin: 16,
    dotsEach: 1,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  })

  carouselHomeExplore.owlCarousel({
    loop: false,
    nav: false,
    dots: false,
    freeDrag: false,
    autoplayTimeout: 2000,
    margin: 16,
    responsive: {
      0: {
        items: 1,
        stagePadding: 30,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  })

  carouselHomeLastHour.owlCarousel({
    loop: false,
    nav: false,
    dots: false,
    freeDrag: false,
    autoplayTimeout: 2000,
    margin: 16,
    responsive: {
      0: {
        items: 1,
        stagePadding: 30,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
      1300: {
        items: 4,
      },
    },
  })

  function updateNavButtons(event) {
    const currentIndex = event.item.index // Vị trí hiện tại
    const itemCount = event.item.count // Tổng số slide
    const visibleItems = event.page.size // Số mục hiển thị trên trang hiện tại

    // Vô hiệu hóa nút "prev" nếu ở đầu
    $('#explore-slide-prev').prop('disabled', currentIndex === 0)

    // Vô hiệu hóa nút "next" nếu đã ở cuối
    $('#explore-slide-next').prop(
      'disabled',
      currentIndex + visibleItems >= itemCount
    )
  }
  carouselHomeExplore.on('initialized.owl.carousel', function (event) {
    updateNavButtons(event)
  })

  carouselHomeExplore.on('changed.owl.carousel', updateNavButtons)

  $('#explore-slide-prev').click(function () {
    carouselHomeExplore.trigger('prev.owl.carousel')
  })
  $('#explore-slide-next').click(function () {
    carouselHomeExplore.trigger('next.owl.carousel')
  })
  const initialEvent = {
    item: {
      index: carouselHomeExplore.data('owl.carousel')._current,
      count: carouselHomeExplore.data('owl.carousel')._items.length,
    },
    page: {
      size: carouselHomeExplore.data('owl.carousel').options.responsive[1000]
        .items, // lấy số items từ cấu hình responsive
    },
  }
  updateNavButtons(initialEvent)

  //last hour

  function updateNavButtonsLastHour(event) {
    const currentIndex = event.item.index // Vị trí hiện tại
    const itemCount = event.item.count // Tổng số slide
    const visibleItems = event.page.size // Số mục hiển thị trên trang hiện tại

    $('#lasthour-slide-prev').prop('disabled', currentIndex === 0)
    $('#lasthour-slide-next').prop(
      'disabled',
      currentIndex + visibleItems >= itemCount
    )
  }
  carouselHomeLastHour.on('initialized.owl.carousel', function (event) {
    updateNavButtonsLastHour(event)
  })

  carouselHomeLastHour.on('changed.owl.carousel', updateNavButtonsLastHour)
  $('#lasthour-slide-prev').click(function () {
    carouselHomeLastHour.trigger('prev.owl.carousel')
  })
  $('#lasthour-slide-next').click(function () {
    carouselHomeLastHour.trigger('next.owl.carousel')
  })
  const initialEventLastHour = {
    item: {
      index: carouselHomeLastHour.data('owl.carousel')._current,
      count: carouselHomeLastHour.data('owl.carousel')._items.length,
    },
    page: {
      size: carouselHomeLastHour.data('owl.carousel').options.responsive[1000]
        .items, // lấy số items từ cấu hình responsive
    },
  }
  updateNavButtonsLastHour(initialEventLastHour)

  // Tabs
  const $indicator = $('<div class="tabs__indicator"></div>')
  $('#tab-search .tabs__head').append($indicator)

  // Hàm di chuyển indicator đến tab đang active
  function moveIndicator($activeTab) {
    const tabLeft = $activeTab.position().left
    const tabWidth = $activeTab.outerWidth()

    $indicator.css({
      left: tabLeft,
      width: tabWidth,
    })
  }

  // Thiết lập vị trí ban đầu của indicator dựa trên tab active
  const $initialTab = $('#tab-search .tabs__head__item.active')
  moveIndicator($initialTab)

  // Xử lý sự kiện click cho các tab
  $('.tabs__head__item').click(function () {
    $('.tabs__head__item').removeClass('active') // Xóa class active khỏi các tab khác
    $(this).addClass('active') // Thêm class active cho tab được chọn
    moveIndicator($(this)) // Di chuyển indicator tới tab được chọn
  })

  // Date
  $('input[name="start-date"]').daterangepicker(
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

  $('#tab-combo .tabs-circle__head .tabs-circle__head__item').click(
    function () {
      $('.tabs-circle__head__item').removeClass('active')
      $(this).addClass('active')
    }
  )

  // Select
  $('#sort-tour').vSelect({
    trayHeight: '250px',
    multiSelect: false,
    display: 'values',
    search: true,
    searchPosition: -1,
  })

  // Mobile menu search
  $('.box-search__item').click(function () {
    $('#form-search-mobile').addClass('active') // Hiển thị với animation mờ dần
  })

  // Khi click vào #close-mobile, ẩn #form-search-mobile
  $('#close-mobile').click(function () {
    $('#form-search-mobile').removeClass('active') // Ẩn với animation mờ dần
  })
})
