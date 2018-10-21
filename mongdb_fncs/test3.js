db.loadServerScripts()
query(db.getCollection("lv.Demo_TaiLieuSo"))
.match("folder_name=='Dịch vụ Chăm sóc sắc đẹp'",/quản/i)
.items()
