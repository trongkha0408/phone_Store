window.addEventListener('load', function(){
    this.document.getElementById("submit").addEventListener("click", function(e){
        const email = document.getElementById("email").value;
        const password = document.getElementById("pwd").value;
        if (email == ""){
            e.preventDefault();
            document.getElementById("error").innerHTML = "Email không được bỏ trống.";
        }
        else if (!validateEmail(email)){
            e.preventDefault();
            document.getElementById("error").innerHTML = "Email không hợp lệ.";
        }
        
        else if (password == ""){
            e.preventDefault();
            document.getElementById("error").innerHTML = "Mật khẩu không được bỏ trống.";
        }
        else if (!validatePassword(password)){
            e.preventDefault();
            document.getElementById("error").innerHTML = "Mật khẩu phải chứa ít nhất 6 kí tự.";
        }
    });
})

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const validatePassword = (password) => {
    return String(password)
    .length >= 6
}


var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}