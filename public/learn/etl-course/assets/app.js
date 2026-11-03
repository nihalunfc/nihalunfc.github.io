(function(){
  var KEY="p2d-progress-v1", NKEY="p2d-notes-v1";
  function load(k){try{return JSON.parse(localStorage.getItem(k)||"{}")}catch(e){return {}}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  var done=load(KEY), notes=load(NKEY), days=window.COURSE_DAYS||[];
  function paint(){
    document.querySelectorAll("a[data-day]").forEach(function(a){a.classList.toggle("is-done",!!done[a.dataset.day])});
    document.querySelectorAll("[data-action=complete]").forEach(function(b){var d=!!done[b.dataset.day];b.classList.toggle("is-done",d);b.textContent=d?"✓ Completed (click to undo)":"Mark day "+b.dataset.day.replace("day-","").replace(/^0/,"")+" complete"});
    var total=days.length,n=days.filter(function(d){return done[d.slug]}).length;
    document.querySelectorAll("[data-allbar]").forEach(function(s){s.style.width=(total?100*n/total:0)+"%"});
    document.querySelectorAll("[data-progress-text]").forEach(function(p){p.textContent=n+" of "+total+" days complete"+(n?" · about "+(n*4)+" hours in":"")});
    document.querySelectorAll("[data-weekbar]").forEach(function(s){var w=+s.dataset.weekbar,ds=days.filter(function(d){return d.week===w}),k=ds.filter(function(d){return done[d.slug]}).length;s.style.width=(ds.length?100*k/ds.length:0)+"%"});
    document.querySelectorAll(".wprog").forEach(function(s){var w=+s.dataset.week,ds=days.filter(function(d){return d.week===w}),k=ds.filter(function(d){return done[d.slug]}).length;s.textContent=k+"/"+ds.length});
    var next=days.find(function(d){return !done[d.slug]});
    document.querySelectorAll("[data-action=resume]").forEach(function(a){if(next){a.href="/learn/etl-course/days/"+next.slug+"/";a.textContent=n?"Continue: Day "+next.day+" · "+next.title:"Start Day 1"}else{a.textContent="Course complete 🎉";a.href="/learn/etl-course/pages/projects/"}});
  }
  document.addEventListener("click",function(e){
    var t=e.target.closest("[data-action]"); if(!t) return;
    var a=t.dataset.action;
    if(a==="complete"){done[t.dataset.day]=!done[t.dataset.day]; if(!done[t.dataset.day]) delete done[t.dataset.day]; save(KEY,done); paint();}
    if(a==="menu"){document.body.classList.toggle("nav-open")}
    if(a==="grade"){
      var quiz=t.closest(".quiz"),right=0,qs=quiz.querySelectorAll(".q");
      qs.forEach(function(q){
        q.querySelectorAll("label").forEach(function(l){l.classList.remove("right","wrong")});
        var pick=q.querySelector("input:checked");
        q.querySelectorAll("input").forEach(function(i){if(i.dataset.ok==="1")i.closest("label").classList.add("right")});
        if(pick){ if(pick.dataset.ok==="1") right++; else pick.closest("label").classList.add("wrong"); }
        q.querySelector(".why").hidden=false;
      });
      quiz.querySelector(".score").textContent=right+" / "+qs.length+" correct";
    }
  });
  document.querySelectorAll("textarea[data-notes]").forEach(function(ta){
    ta.value=notes[ta.dataset.notes]||"";
    ta.addEventListener("input",function(){notes[ta.dataset.notes]=ta.value;save(NKEY,notes)});
  });
  if(window.hljs){document.querySelectorAll("pre code").forEach(function(c){var m=(c.className.match(/language-(\w+)/)||[])[1];if(m&&!hljs.getLanguage(m)){c.classList.add("hljs");return}try{hljs.highlightElement(c)}catch(e){}})}
  /* Backup and restore: progress and notes live only in this browser, so learners
     download a file and load it again to continue elsewhere. Nothing is sent anywhere.
     A prominent notice is shown on the course home page, and a short reminder on every
     other page while the learner has progress that hasn't been backed up. */
  var BKEY="p2d-last-backup-v1";
  function lastBackup(){try{return localStorage.getItem(BKEY)}catch(e){return null}}
  function fmtD(s){try{return new Date(s).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"})}catch(e){return s}}
  function doBackup(msg){
    var data={course:"pipeline-to-dashboard",saved:new Date().toISOString(),progress:done,notes:notes};
    var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
    a.download="pipeline-to-dashboard-progress-"+data.saved.slice(0,10)+".json";document.body.appendChild(a);a.click();a.remove();
    try{localStorage.setItem(BKEY,data.saved)}catch(e){}
    if(msg)msg.textContent="Backup downloaded. Keep this file: you'll load it to continue in another browser or device.";
    paintBk();
  }
  function paintBk(){
    var lb=lastBackup(),n=Object.keys(done).length;
    document.querySelectorAll("[data-bk-status]").forEach(function(el){
      el.textContent=lb?"Last backup: "+fmtD(lb)+".":(n?"You have "+n+" day"+(n===1?"":"s")+" of progress and no backup yet.":"No progress yet.");
    });
    var r=document.querySelector(".bk-remind");
    if(r)r.hidden=!(n&&!lb);
  }
  var pt=document.querySelector("[data-progress-text]");
  if(pt){
    var box=document.createElement("section");box.className="backup";box.setAttribute("aria-labelledby","bk-h");
    box.innerHTML='<h2 id="bk-h">Your progress is saved in this browser only</h2>'+
      '<p>Ticks, quiz answers and notes save automatically on this device, in this browser. Nothing is sent to a server, and there is no account.</p>'+
      '<p><b>You will lose your progress if you don\'t back it up and:</b></p>'+
      '<ul><li>you clear your browser\'s history, cookies or site data;</li>'+
      '<li>you use a private or incognito window (it\'s wiped when the window closes);</li>'+
      '<li>you switch to another browser, computer or phone;</li>'+
      '<li>your browser removes site data on its own (Safari and iPhone can do this after about 7 days without a visit), or you reinstall it.</li></ul>'+
      '<p><b>To keep it:</b> press <b>Download backup</b> now and then, and keep the file. <b>To continue</b> in another browser or device, open this page there and press <b>Load backup</b> with that file. Your progress comes back only after you load it.</p>'+
      '<div class="bk-row"><button type="button" class="btn" data-bk="save">Download backup</button><label class="btn ghost">Load backup<input type="file" accept=".json,application/json" hidden></label><span class="bk-status" data-bk-status></span></div>'+
      '<p class="bk-msg" role="status"></p>';
    pt.parentNode.insertBefore(box,pt.nextSibling);
    var msg=box.querySelector(".bk-msg");
    box.querySelector("[data-bk=save]").addEventListener("click",function(){doBackup(msg)});
    box.querySelector("input[type=file]").addEventListener("change",function(e){
      var f=e.target.files[0];if(!f)return;var r=new FileReader();
      r.onload=function(){try{var d=JSON.parse(r.result);if(d.course!=="pipeline-to-dashboard")throw 0;done=d.progress||{};notes=d.notes||{};save(KEY,done);save(NKEY,notes);try{localStorage.setItem(BKEY,d.saved||new Date().toISOString())}catch(x){}paint();paintBk();msg.textContent="Backup loaded: "+Object.keys(done).length+" days complete. You can carry on from here."}catch(err){msg.textContent="That file isn't a backup from this course."}};
      r.readAsText(f);
    });
  } else {
    var main=document.querySelector("main")||document.body;
    var rm=document.createElement("p");rm.className="bk-remind";rm.hidden=true;
    rm.innerHTML='Your progress is only in this browser and isn\'t backed up. <a href="/learn/etl-course/#bk-h">Download a backup</a> so you don\'t lose it.';
    main.insertBefore(rm,main.firstChild);
  }
  document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-action=complete]");if(t)setTimeout(paintBk,0)});
  paintBk();
  paint();
})();
