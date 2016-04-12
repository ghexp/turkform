// ================================================================
// Function to submit form to Server
// The form is submitted to MTurk after server successfully process the submission
// The HIT is completed after MTurk server receives the submission
// ================================================================
function submit_form(){

    // process answers
    // pack user's response in a dictionary structure and send to the server in JSON format
    // TODO: fill in the answers you'd like to send back to server
    answers = [];

    var ans = JSON.stringify(answers);
    var duration = ($.now()-init_time)/1000;
    duration = duration.toString();

    // set the resp to send back to the server here
    // the values to send to MTurk has already defined inside #mturk_form
    // if you don't need to bother to set value here

    var hitVal = document.getElementById('hitId').value;
    var assignmentVal = document.getElementById('assignmentId').value;
    var workerVal = document.getElementById('workerId').value;

    annotations = [];
    for (var ii = 0; ii < Anno.length; ii++) {
      for (jj = 0; jj < Anno[ii].ans.length; jj++) {
        for (kk = 0; kk < Anno[ii].ans[jj].length; kk++) {
          if (Anno[ii].ans[jj][kk] == 1) {
	      var img = document.getElementById('im-panel-0');
	      pos = [];
	      pos.push(Anno[ii].annoloc[jj][kk][0] - img.offsetLeft);
	      pos.push(Anno[ii].annoloc[jj][kk][1] - img.offsetTop);
              annotation = {
                "id": kk,
                "image_id": ii,
                "coco_url": im_urls[ii],
                "flickr_url": im_urls[ii],
                "category_id": jj,
                //"segmentation": RLE or[polygon],
                //"area": float,
                  //"bbox": [x, y, width, height],
                "pos": pos,
                "iscrowd": 0,
                "hitId": hitVal,
                "assignmentId": assignmentVal,
                "workerId": workerVal,

              }
              annotations.push(annotation);
              hideMarker(ii, jj, kk);
              ctrler.render_anno();
            }
        }
      }
    }



    resp = {
      "annotations": annotations
    };

    //ctrler.turn_off_panels();
    // post ajax request to server
    // if there's no backend to process the request, form can be directly submitted to MTurk
    $.ajax({
      type: "POST",
      // "TODO: set the url of server to process the data",
      //url: "http://localhost:3000/submit_label",
      url: "https://d1hjgeda31jqt0.cloudfront.net/submit_label",
      crossDomain: true,
      dataType: 'json',
      data: {'resp':JSON.stringify(resp)}
      //data:resp
    }).done(function(data) {
      im_urls = data.image_urls;
      im_ids  = data.image_ids;
      //loadImages();
      init();
      // TODO bad
      // removing all listeners so that imClick_Ctrl can add them back TODO refactor
      $(document.body).find("*").off();
      $(document).off('keyup');

        $('#mturk_form').submit();
    });
}
