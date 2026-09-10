import Swal from 'sweetalert2'

export function showAlert({ title, icon ,time=3000 ,text=""}) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    text:text,
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: time,
    timerProgressBar: true
  })
}