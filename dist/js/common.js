$(document).ready(function () {
  $('#toggle-menu').click(function () {
    $('.menu-mobile').addClass('active') // Hiển thị với hiệu ứng mờ dần
  })

  // Khi click vào #close-menu, ẩn .menu-mobile
  $('#close-menu').click(function () {
    $('.menu-mobile').removeClass('active') // Ẩn với hiệu ứng mờ dần
  })
  $('.menu-mobile').click(function (event) {
    // Kiểm tra nếu click không nằm trong .menu-mobile__content
    if (!$(event.target).closest('.menu-mobile__content').length) {
      $('.menu-mobile').removeClass('active')
    }
  })
})
