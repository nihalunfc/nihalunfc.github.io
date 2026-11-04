/* Progress for courses built by Astro (src/pages/learn/[course]/). Ticks and notes are kept in
   this browser only (localStorage), with a backup file the learner can download and load.
   The page sets <body data-course="id" data-key="localStorage key"> and window.COURSE_LESSONS. */
(function(){
  var B=document.body,ID=B.dataset.course,KEY=B.dataset.key,NKEY=KEY+"-notes",BKEY=KEY+"-backup",HOME="/learn/"+ID+"/";
  function load(k){try{return JSON.parse(localStorage.getItem(k)||"{}")}catch(e){return {}}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  var done=load(KEY),notes=load(NKEY),L=window.COURSE_LESSONS||[];
  function paint(){
    document.querySelectorAll("a[data-lesson]").forEach(function(a){a.classList.toggle("is-done",!!done[a.dataset.lesson])});
    document.querySelectorAll("[data-action=complete]").forEach(function(b){var d=!!done[b.dataset.lesson];b.classList.toggle("is-done",d);b.textContent=d?"✓ Completed (click to undo)":"Mark this lesson complete"});
    var n=L.filter(function(l){return done[l.slug]}).length,mins=L.filter(function(l){return done[l.slug]}).reduce(function(s,l){return s+l.minutes},0);
    document.querySelectorAll("[data-allbar]").forEach(function(s){s.style.width=(L.length?100*n/L.length:0)+"%"});
    document.querySelectorAll("[data-progress-text]").forEach(function(p){p.textContent=n+" of "+L.length+" lessons complete"+(n?" · about "+Math.round(mins/6)/10+" hours in":"")});
    document.querySelectorAll("[data-modbar]").forEach(function(s){var m=+s.dataset.modbar,ls=L.filter(function(l){return l.module===m}),k=ls.filter(function(l){return done[l.slug]}).length;s.style.width=(ls.length?100*k/ls.length:0)+"%"});
    document.querySelectorAll("[data-modprog]").forEach(function(s){var m=+s.dataset.modprog,ls=L.filter(function(l){return l.module===m}),k=ls.filter(function(l){return done[l.slug]}).length;s.textContent=k+"/"+ls.length});
    var next=L.find(function(l){return !done[l.slug]});
    document.querySelectorAll("[data-action=resume]").forEach(function(a){if(next){a.href=next.href;a.textContent=n?"Continue: "+next.title:"Start lesson 1"}else{a.textContent="Course complete 🎉";a.href=HOME+"pages/projects/"}});
  }
  document.addEventListener("click",function(e){
    var t=e.target.closest("[data-action]");if(!t)return;var a=t.dataset.action;
    if(a==="complete"){done[t.dataset.lesson]=!done[t.dataset.lesson];if(!done[t.dataset.lesson])delete done[t.dataset.lesson];save(KEY,done);paint();paintBk()}
    if(a==="menu")document.body.classList.toggle("nav-open");
    if(a==="grade"){
      var quiz=t.closest(".quiz"),right=0,qs=quiz.querySelectorAll(".q");
      qs.forEach(function(q){
        q.querySelectorAll("label").forEach(function(l){l.classList.remove("right","wrong")});
        var pick=q.querySelector("input:checked");
        q.querySelectorAll("input").forEach(function(i){if(i.dataset.ok==="1")i.closest("label").classList.add("right")});
        if(pick){if(pick.dataset.ok==="1")right++;else pick.closest("label").classList.add("wrong")}
        q.querySelector(".why").hidden=false;
      });
      quiz.querySelector(".score").textContent=right+" / "+qs.length+" correct";
    }
  });
  document.querySelectorAll("textarea[data-notes]").forEach(function(ta){ta.value=notes[ta.dataset.notes]||"";ta.addEventListener("input",function(){notes[ta.dataset.notes]=ta.value;save(NKEY,notes)})});
  function lastBackup(){try{return localStorage.getItem(BKEY)}catch(e){return null}}
  function fmtD(s){try{return new Date(s).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"})}catch(e){return s}}
  function doBackup(msg){
    var data={course:ID,saved:new Date().toISOString(),progress:done,notes:notes};
    var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
    a.download=ID+"-progress-"+data.saved.slice(0,10)+".json";document.body.appendChild(a);a.click();a.remove();
    try{localStorage.setItem(BKEY,data.saved)}catch(e){}
    if(msg)msg.textContent="Backup downloaded. Keep this file: you'll load it to continue in another browser or device.";
    paintBk();
  }
  function paintBk(){
    var lb=lastBackup(),n=Object.keys(done).length;
    document.querySelectorAll("[data-bk-status]").forEach(function(el){el.textContent=lb?"Last backup: "+fmtD(lb)+".":(n?"You have "+n+" lesson"+(n===1?"":"s")+" of progress and no backup yet.":"No progress yet.")});
    var r=document.querySelector(".bk-remind");if(r)r.hidden=!(n&&!lb);
  }
  var box=document.querySelector(".backup");
  if(box){
    var msg=box.querySelector(".bk-msg");
    box.querySelector("[data-bk=save]").addEventListener("click",function(){doBackup(msg)});
    box.querySelector("input[type=file]").addEventListener("change",function(e){
      var f=e.target.files[0];if(!f)return;var r=new FileReader();
      r.onload=function(){try{var d=JSON.parse(r.result);if(d.course!==ID)throw 0;done=d.progress||{};notes=d.notes||{};save(KEY,done);save(NKEY,notes);try{localStorage.setItem(BKEY,d.saved||new Date().toISOString())}catch(x){}paint();paintBk();msg.textContent="Backup loaded: "+Object.keys(done).length+" lessons complete. You can carry on from here."}catch(err){msg.textContent="That file isn't a backup from this course."}};
      r.readAsText(f);
    });
  }
  paintBk();paint();
})();
