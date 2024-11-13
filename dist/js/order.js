$(document).ready(function () {
  $('.info-detail__common__mobile').click(function () {
    $('.info-detail__common').slideToggle() // Thêm hiệu ứng toggle
    $('.info-detail__common').toggleClass('active') // Thêm hiệu ứng toggle
    $(this).toggleClass('active')
  })

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
