/* =========================================================
   CYRUS TOURIST — سیستم علاقه‌مندی‌ها (برگزیده‌ها)
   ذخیره‌سازی محلی (localStorage) فیلم‌های گردشگری و اقامتی
   که کاربر با کلید ❤️ به علاقه‌مندی‌ها اضافه کرده است.
========================================================= */
(function(){
  var KEY = "cyrusFavorites";

  function loadAll(){
    var data = {};
    try{
      var raw = localStorage.getItem(KEY);
      data = raw ? JSON.parse(raw) : {};
    }catch(e){
      data = {};
    }
    if(!Array.isArray(data.tourism)) data.tourism = [];
    if(!Array.isArray(data.residence)) data.residence = [];
    return data;
  }

  function saveAll(data){
    try{
      localStorage.setItem(KEY, JSON.stringify(data));
    }catch(e){}
  }

  function isFav(type, id){
    var data = loadAll();
    var list = data[type] || [];
    id = String(id);
    for(var i=0;i<list.length;i++){
      if(String(list[i].id) === id) return true;
    }
    return false;
  }

  /* item = {id, title, loc, hash, href, badge, sub} */
  function toggle(type, item){
    var data = loadAll();
    var list = data[type] || (data[type] = []);
    var id = String(item.id);
    var idx = -1;
    for(var i=0;i<list.length;i++){
      if(String(list[i].id) === id){ idx = i; break; }
    }
    var nowFav;
    if(idx === -1){
      list.unshift(item);
      nowFav = true;
    } else {
      list.splice(idx,1);
      nowFav = false;
    }
    saveAll(data);
    return nowFav;
  }

  function remove(type, id){
    var data = loadAll();
    id = String(id);
    data[type] = (data[type] || []).filter(function(it){
      return String(it.id) !== id;
    });
    saveAll(data);
  }

  function count(){
    var data = loadAll();
    return (data.tourism ? data.tourism.length : 0) + (data.residence ? data.residence.length : 0);
  }

  window.CyrusFavorites = {
    loadAll: loadAll,
    isFav: isFav,
    toggle: toggle,
    remove: remove,
    count: count
  };
})();
