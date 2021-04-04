$('document').ready(function() {
  console.log("doc ready");

  const { TesseractWorker, utils: { loadLang } } = Tesseract;
  const worker = new TesseractWorker();

  $("#image").change(function(event) {
     console.log("starting");
     // console.log($("#image"));
     //console.log(event.target.files[0]);
     //var fileList = inputElement.files;
     var file = event.target.files[0];

     loadLang({ langs: 'deu', langPath: worker.options.langPath })
      .then(() => {
        worker
          .recognize(file)
          .progress(p => console.log(p))
          .then((result) => {
            console.log(result.text);
            alert(result.text);
            worker.terminate();
          });
      });
   });
});

/*
$('document').ready(function() {
  console.log("doc ready");

  const { TesseractWorker } = Tesseract;
  const worker = new TesseractWorker();

  $("#image").change(function(event) {
     console.log("starting");
     // console.log($("#image"));
     //console.log(event.target.files[0]);
     //var fileList = inputElement.files;
     var file = event.target.files[0];

     worker
       .recognize(file)
       .progress((p) => {
         console.log('progress', p);
       })
       .then(({ text }) => {
         console.log(text);
         worker.terminate();
       });
   });
});
*/
