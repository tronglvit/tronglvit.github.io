$(document).ready(function () {
  $('.info-detail__common__mobile').click(function () {
    $('.info-detail__common').slideToggle() // Thêm hiệu ứng toggle
    $('.info-detail__common').toggleClass('active') // Thêm hiệu ứng toggle
    $(this).toggleClass('active')
  })
})
