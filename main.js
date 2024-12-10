const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "Bookshelf";
const form = document.getElementById("inputBook");
const inputSearchBook = document.getElementById("searchBookTitle");
const formSearchBook = document.getElementById("searchBook");

inputSearchBook.addEventListener("keyup", (e) => {
   e.preventDefault();
   searchBooks();
});

formSearchBook.addEventListener("submit", (e) => {
   e.preventDefault();
   searchBooks();
});


function isStorageExist() {
   if (typeof Storage === "undefined") {
      swal("Upss", "MBrowser yang anda gunakan tidak mendukung web storage. Silahkan gunakan Browser yang lainnya");
      return false;
   }
   return true;
}


const generateId = () => +new Date();


const generateBookItem = (id, title, author, year, isCompleted) => {
   return {
      id,
      title,
      author,
      year: parseInt(year),
      isCompleted,
   };
};


function checkStatusBook() {
   const isCheckComplete = document.getElementById("inputBookIsComplete");
   if (isCheckComplete.checked) {
      return true;
   }
   return false;
}


function addBook() {
   const bookTitle = document.getElementById("inputBookTitle").value;
   const bookAuthor = document.getElementById("inputBookAuthor").value;
   const bookYear = document.getElementById("inputBookYear").value;
   const isCompleted = checkStatusBook();
   

   const id = generateId();
   const newBook = generateBookItem(id, bookTitle, bookAuthor, bookYear, isCompleted);

   books.unshift(newBook);
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();

   swal("Berhasil", "Buku baru sudah ditambahkan ke rak", "success");
}


function findBookIndex(bookId) {
   for (const index in books) {
      if (books[index].id == bookId) {
         return index;
      }
   }
   return null;
}


function removeBook(bookId) {
   const bookTarget = findBookIndex(bookId);
   swal({
      title: "Apakah Anda Yakin?",
      text: "Buku akan dihapus secara permanen, Anda tidak bisa memulihkannya kembali!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
   }).then((willDelete) => {
      if (willDelete) {
         books.splice(bookTarget, 1);
         document.dispatchEvent(new Event(RENDER_EVENT));
         saveData();

         swal("Berhasil", "Satu buku sudah dihapus dari rak", "success");
      } else {
         swal("Buku tidak jadi dihapus");
      }
   });
}



function changeBookStatus(bookId) {
   const bookIndex = findBookIndex(bookId);
   for (const index in books) {
      if (index === bookIndex) {
         if (books[index].isCompleted === true) {
            books[index].isCompleted = false;
            swal("Berhasil", "Buku kamu sudah dipindahkan ke rak belum selesai dibaca", "success");
         } else {
            books[index].isCompleted = true;
            swal("Berhasil", "Buku kamu sudah dipindahkan ke rak selesai dibaca", "success");
         }
      }
   }

   document.dispatchEvent(new Event(RENDER_EVENT));
   saveData();
}

function searchBooks() {
   const inputSearchValue = document.getElementById("searchBookTitle").value.toLowerCase();
   const incompleteBookShelf = document.getElementById("incompleteBookshelfList");
   const completeBookShelf = document.getElementById("completeBookshelfList");
   incompleteBookShelf.innerHTML = "";
   completeBookShelf.innerHTML = "";

   if (inputSearchValue == "") {
      document.dispatchEvent(new Event(RENDER_EVENT));
      return;
   }

   for (const book of books) {
      if (book.title.toLowerCase().includes(inputSearchValue)) {
         if (book.isCompleted == false) {
            let tampilkan = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>

               <div class="action">
                  <button class="btn-green" onclick="changeBookStatus(${book.id})">Selesai di Baca</button>
                  <button class="btn-red" onclick="removeBook(${book.id})">Hapus Buku</button>
                  </div>
            </article>
            `;

            incompleteBookShelf.innerHTML += tampilkan;
         } else {
            let tampilkan = `
            <article class="book_item">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>

               <div class="action">
                  <button class="btn-green" onclick="changeBookStatus(${book.id})">Belum selesai di Baca</button>
                  <button class="btn-red" onclick="removeBook(${book.id})">Hapus Buku</button>
                  </div>
            </article>
            `;

            completeBookShelf.innerHTML += tampilkan;
         }
      }
   }
}



function saveData() {
   if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);

      document.dispatchEvent(new Event(RENDER_EVENT));
   }
}


function loadDataFromStorage() {
   const serializedData = localStorage.getItem(STORAGE_KEY);
   let data = JSON.parse(serializedData);

   if (data !== null) {
      data.forEach((book) => {
         books.unshift(book);
      });
   }
   document.dispatchEvent(new Event(RENDER_EVENT));
   return books;
}

function showBook(books = []) {
   const incompleteBookShelf = document.getElementById("incompleteBookshelfList");
   const completeBookShelf = document.getElementById("completeBookshelfList");

   incompleteBookShelf.innerHTML = "";
   completeBookShelf.innerHTML = "";

   books.forEach((book) => {
      if (book.isCompleted == false) {
         let tampilkan = `
            <article class="book_item">
               <img class="gambar" src="assets/coverBuku.jpg" alt="">
               <aside class="side">
                  <h3>${book.title}</h3>
                  <p>Penulis : ${book.author}</p>
                  <p>Tahun Terbit : ${book.year}</p>

                  <div class="action">
                     <button class="btn-green" onclick="changeBookStatus(${book.id})"><i class="fa-solid fa-circle-check" style="color: #0aff0e;"></i></button>
                     <button class="btn-red" onclick="removeBook(${book.id})"><i class="fa-solid fa-trash" style="color: #fe0b0b;"></i></button>
                  </div>
               </aside>
            </article>
            `;

         incompleteBookShelf.innerHTML += tampilkan;
      } else {
         let tampilkan = `
         <article class="book_item">
            <img class="gambar" src="assets/coverBuku.jpg" alt="">
            <aside class="side">
               <h3>${book.title}</h3>
               <p>Penulis : ${book.author}</p>
               <p>Tahun Terbit : ${book.year}</p>

               <div class="action">
                  <button class="btn-green" onclick="changeBookStatus(${book.id})"><i class="fa-solid fa-arrow-rotate-left" style="color: #ffa200;"></i></button>
                  <button class="btn-red" onclick="removeBook(${book.id})"><i class="fa-solid fa-trash" style="color: #fe0b0b;"></i></button>
               </div>
            </aside>
         </article>
            `;

         completeBookShelf.innerHTML += tampilkan;
      }
   });
}


document.addEventListener("DOMContentLoaded", function () {
   form.addEventListener("submit", function (e) {
      e.preventDefault();
      addBook();
   });

   if (isStorageExist()) {
      loadDataFromStorage();
   }
});


document.addEventListener(RENDER_EVENT, () => {
   showBook(books);
});
