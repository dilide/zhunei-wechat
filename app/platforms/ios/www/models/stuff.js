function CathAssistDB(){	try	{		this.db = openDatabase(this.dbName, this.dbVersion, "database for cathassist.org", 200000);	}	catch(e)	{		alert("目前『天主教小助手』无法支持你的系统！");	}	this.db.transaction(function(tx){		tx.executeSql('CREATE TABLE IF NOT EXISTS stuff (date unique,mass,med,comp,let,lod,thought,ordo,ves,saint)');		tx.executeSql('CREATE TABLE IF NOT EXISTS vaticanacn (id integer unique,title,pic,content,cate,time)');		tx.executeSql('CREATE TABLE IF NOT EXISTS faithlife (id integer unique,title,pic,content,cate,time)');		tx.executeSql('CREATE TABLE IF NOT EXISTS articles (id integer unique,title,pic,content,cate,time)');	});}CathAssistDB.prototype = {	db:null,	dbName:"CathAssist",	dbVersion:"0.9",	server:"http://cathassist.org/",	countPerPage:10,//每页个数	clearAll:function(){		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('drop table stuff;');			tx.executeSql('drop table vaticanacn;');			tx.executeSql('drop table faithlife;');			tx.executeSql('drop table articles;');			tx.executeSql('CREATE TABLE IF NOT EXISTS stuff (date unique,mass,med,comp,let,lod,thought,ordo,ves,saint)');			tx.executeSql('CREATE TABLE IF NOT EXISTS vaticanacn (id integer unique,title,pic,content,cate,time)');			tx.executeSql('CREATE TABLE IF NOT EXISTS faithlife (id integer unique,title,pic,content,cate,time)');			tx.executeSql('CREATE TABLE IF NOT EXISTS articles (id integer unique,title,pic,content,cate,time)');		});	},	//Stuff操作    getStuff:function(date,type,callback){		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('select mass,med,comp,let,lod,thought,ordo,ves,saint from stuff where date=?', [date], function(tx,r){				if(r.rows.length>0)				{					if(callback)					{						if(type=="" || (!type))							callback(r.rows.item(0));						else							callback(r.rows.item(0)[type]);					}				}				else				{					$.getJSON(localDB.server+"getstuff/getstuff2.php?date="+date+"&type=jsonp&callback=?",						function(obj){							localDB.setStuff(date,obj);							if(callback)							{								if(type=="" || (!type))									callback(obj);								else									callback(obj[type]);							}						}					);				}			});		});    },	updateStuff:function(date,callback){		$.getJSON(localDB.server+"getstuff/getstuff2.php?date="+date+"&type=jsonp&callback=?",			function(obj){				localDB.setStuff(date,obj);				if(callback)				{					callback(obj);				}			}		);	},	setStuff:function(date,data){		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('delete from stuff where date=?', [date]);			tx.executeSql('insert into stuff(date,mass,med,comp,let,lod,thought,ordo,ves,saint) values(?,?,?,?,?,?,?,?,?,?)',[date,data['mass'],data['med'],data['comp'],data['let'],data['lod'],data['thought'],data['ordo'],data['ves'],data['saint']]);		});	},		/*Article操作*/	//Vaticanacn文章操作	getVaticanacnList:function(from,callback,refresh){		if(!localDB.db)			return null;				if(refresh)		{			$.getJSON(localDB.server+"vaticanacn/getarticle.php?type=jsonp&mode=list&from="+from+"&&callback=?",				function(obj){					if(callback)					{						localDB.setVaticanacnList(obj);						callback(obj);					}				}			);		}		else		{			localDB.db.transaction(function(tx){				if(from<0)				{					from = 9999999;				}				tx.executeSql('select id,title,pic,content,cate,time from vaticanacn where id<? order by id desc limit ?', [from,localDB.countPerPage], function(tx,r){					if(r.rows.length>0)					{						if(callback)						{							var obj = new Array();							for (var i=0; i<r.rows.length; i++)							{								obj[i] = r.rows.item(i);							}							callback(obj);						}					}					else					{						$.getJSON(localDB.server+"vaticanacn/getarticle.php?type=jsonp&mode=list&from="+from+"&&callback=?",							function(obj){								if(callback)								{									localDB.setVaticanacnList(obj);									callback(obj);								}							}						);					}				},function(tx,r){refresh = true;});			});		}	},	getVaticanacnBackList:function(to,callback)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('select id,title,pic,content,cate,time from vaticanacn where id>? order by id asc limit ?', [to,localDB.countPerPage], function(tx,r){				if(callback)				{					var obj = new Array();					for (var i=0; i<r.rows.length; i++)					{						obj[r.rows.length-i-1] = r.rows.item(i);					}					callback(obj);				}			},function(tx,r){refresh = true;});		});	},	setVaticanacnList:function(obj)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			for(var i in obj)			{				tx.executeSql('delete from vaticanacn where id=?', [obj[i].id]);				tx.executeSql('insert into vaticanacn(id,title,pic,cate,time) values(?,?,?,?,?)',[obj[i].id,obj[i].title,obj[i].pic,obj[i].cate,obj[i].time]);			}		});	},	getVaticanacnItem:function(id,callback)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('select id,title,pic,content,cate,time from vaticanacn where id=?', [id], function(tx,r){				if(r.rows.length>0 && (r.rows.item(0).content!="" && r.rows.item(0).content!=null))				{					if(callback)					{						callback(r.rows.item(0));					}				}				else				{					$.getJSON(localDB.server+"vaticanacn/getarticle.php?type=jsonp&mode=item&id="+id+"&&callback=?",						function(obj){							if(callback)							{								localDB.setVaticanacnItem(obj);								callback(obj);							}						}					);				}			},function(tx,r){refresh = true;});		});	},	setVaticanacnItem:function(obj)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('update vaticanacn set content=? where id=?',[obj.content,obj.id]);		});	},		//FaithLife文章操作	getFaithLifeList:function(from,callback,refresh){		if(!localDB.db)			return null;				if(refresh)		{			$.getJSON(localDB.server+"faithlife/getarticle.php?type=jsonp&mode=list&from="+from+"&&callback=?",				function(obj){					if(callback)					{						localDB.setFaithLifeList(obj);						callback(obj);					}				}			);		}		else		{			localDB.db.transaction(function(tx){				if(from<0)				{					from = 9999999;				}				tx.executeSql('select id,title,pic,content,cate,time from faithlife where id<? order by id desc limit ?', [from,localDB.countPerPage], function(tx,r){					if(r.rows.length>0)					{						if(callback)						{							var obj = new Array();							for (var i=0; i<r.rows.length; i++)							{								obj[i] = r.rows.item(i);							}							callback(obj);						}					}					else					{						$.getJSON(localDB.server+"faithlife/getarticle.php?type=jsonp&mode=list&from="+from+"&&callback=?",							function(obj){								if(callback)								{									localDB.setFaithLifeList(obj);									callback(obj);								}							}						);					}				},function(tx,r){refresh = true;});			});		}	},	getFaithLifeBackList:function(to,callback)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('select id,title,pic,content,cate,time from faithlife where id>? order by id asc limit ?', [to,localDB.countPerPage], function(tx,r){				if(callback)				{					var obj = new Array();					for (var i=0; i<r.rows.length; i++)					{						obj[r.rows.length-i-1] = r.rows.item(i);					}					callback(obj);				}			},function(tx,r){refresh = true;});		});	},	setFaithLifeList:function(obj)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			for(var i in obj)			{				tx.executeSql('delete from faithlife where id=?', [obj[i].id]);				tx.executeSql('insert into faithlife(id,title,pic,cate,time) values(?,?,?,?,?)',[obj[i].id,obj[i].title,obj[i].pic,obj[i].cate,obj[i].time]);			}		});	},	getFaithLifeItem:function(id,callback)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('select id,title,pic,content,cate,time from faithlife where id=?', [id], function(tx,r){				if(r.rows.length>0 && (r.rows.item(0).content!="" && r.rows.item(0).content!=null))				{					if(callback)					{						callback(r.rows.item(0));					}				}				else				{					$.getJSON(localDB.server+"faithlife/getarticle.php?type=jsonp&mode=item&id="+id+"&&callback=?",						function(obj){							if(callback)							{								localDB.setFaithLifeItem(obj);								callback(obj);							}						}					);				}			},function(tx,r){refresh = true;});		});	},	setFaithLifeItem:function(obj)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('update faithlife set content=? where id=?',[obj.content,obj.id]);		});	},		//Articles文章操作	getArticlesList:function(from,callback,refresh){		if(!localDB.db)			return null;				if(refresh)		{			$.getJSON(localDB.server+"articles/getarticle.php?type=jsonp&mode=list&from="+from+"&&callback=?",				function(obj){					if(callback)					{						localDB.setArticlesList(obj);						callback(obj);					}				}			);		}		else		{			localDB.db.transaction(function(tx){				if(from<0)				{					from = 9999999;				}				tx.executeSql('select id,title,pic,content,cate,time from articles where id<? order by id desc limit ?', [from,localDB.countPerPage], function(tx,r){					if(r.rows.length>0)					{						if(callback)						{							var obj = new Array();							for (var i=0; i<r.rows.length; i++)							{								obj[i] = r.rows.item(i);							}							callback(obj);						}					}					else					{						$.getJSON(localDB.server+"articles/getarticle.php?type=jsonp&mode=list&from="+from+"&&callback=?",							function(obj){								if(callback)								{									localDB.setArticlesList(obj);									callback(obj);								}							}						);					}				},function(tx,r){refresh = true;});			});		}	},	getArticlesBackList:function(to,callback)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('select id,title,pic,content,cate,time from articles where id>? order by id asc limit ?', [to,localDB.countPerPage], function(tx,r){				if(callback)				{					var obj = new Array();					for (var i=0; i<r.rows.length; i++)					{						obj[r.rows.length-i-1] = r.rows.item(i);					}					callback(obj);				}			},function(tx,r){refresh = true;});		});	},	setArticlesList:function(obj)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			for(var i in obj)			{				tx.executeSql('delete from articles where id=?', [obj[i].id]);				tx.executeSql('insert into articles(id,title,pic,cate,time) values(?,?,?,?,?)',[obj[i].id,obj[i].title,obj[i].pic,obj[i].cate,obj[i].time]);			}		});	},	getArticlesItem:function(id,callback)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('select id,title,pic,content,cate,time from articles where id=?', [id], function(tx,r){				if(r.rows.length>0 && (r.rows.item(0).content!="" && r.rows.item(0).content!=null))				{					if(callback)					{						callback(r.rows.item(0));					}				}				else				{					$.getJSON(localDB.server+"articles/getarticle.php?type=jsonp&mode=item&id="+id+"&&callback=?",						function(obj){							if(callback)							{								localDB.setArticlesItem(obj);								callback(obj);							}						}					);				}			},function(tx,r){refresh = true;});		});	},	setArticlesItem:function(obj)	{		if(!localDB.db)			return null;		localDB.db.transaction(function(tx){			tx.executeSql('update articles set content=? where id=?',[obj.content,obj.id]);		});	},		//代祷本操作    getPray:function(callback){		$.getJSON(localDB.server+"pray/getprays.php?type=jsonp&callback=?",			function(obj){				if(callback)				{					callback(obj);				}			}		);    },		//梵蒂冈广播操作    getRadio:function(callback){		$.getJSON(localDB.server+"media/getradio.php?type=jsonp&callback=?",			function(obj){				if(callback)				{					callback(obj);				}			}		);    },		//梵蒂冈广播操作    getMusic:function(callback){		$.getJSON(localDB.server+"music/getmusic.php?type=jsonp&callback=?",			function(obj){				if(callback)				{					aaa = obj;					callback(obj);				}			}		);    }}var localDB = new CathAssistDB();