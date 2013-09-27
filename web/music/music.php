<?php
	require_once("../include/dbconn.php");
	require_once("../include/define.php");
	require_once("../users/user.class.php");
	
	$id = -1;
	if(isset($_GET['id']))
	{
		$id = (int)$_GET['id'];
	}
	if($id<1)
	{
		$result = mysql_query("select * from song L JOIN (SELECT CEIL(MAX(ID)*RAND()) AS ID FROM song) AS m ON L.ID >= m.ID LIMIT 1;");
		if ($row = mysql_fetch_array($result))
		{
			header("Location: music.php?id=".$row['id']);
		}
		exit();
	}

	$mp3 = "";
	$name = "";
	$singer = "";
	$alume = "";
	$pic = "";
	$aid = 0;
	$sid = 0;
	$result = mysql_query('select song.name as name,song.mp3 as mp3,song.alume as aid,song.singer as sid,alume.name as aname,alume.pic as pic,singer.name as sname from song,alume,singer where song.alume=alume.id and song.singer=singer.id and song.id='.$id.';');
	if($row = mysql_fetch_array($result))
	{
		$mp3 = $row['mp3'];
		$name = $row['name'];
		$singer = $row['sname'];
		$alume = $row['aname'];
		$pic = $row['pic'];
		$aid = $row['aid'];
		$sid = $row['sid'];
	}
	else
	{
		die('歌曲不存在！');
	}
	$web_title = $name.'——天主教小助手';
	
	echo('<html><head><title>'.$web_title.'</title><meta http-equiv=Content-Type content="text/html;charset=utf-8"><meta name="viewport" content="user-scalable=no, width=device-width" /><link rel="stylesheet" type="text/css" href="music.css"/><link rel="stylesheet" type="text/css" href="/js/jPlayer/skin/circle.skin/circle.player.css"/><script type="text/javascript" src="/js/jquery-1.9.1.min.js"></script><script type="text/javascript" src="/js/jPlayer/js/jquery.transform.js"></script><script type="text/javascript" src="/js/jPlayer/js/jquery.grab.js"></script><script type="text/javascript" src="/js/jPlayer/js/jquery.jplayer.min.js"></script><script type="text/javascript" src="/js/jPlayer/js/mod.csstransforms.min.js"></script><script type="text/javascript" src="/js/jPlayer/js/circle.player.js"></script><script type="text/javascript">
		$(document).ready(function(){
			var myCirclePlayer = new CirclePlayer("#jquery_jplayer_1",
			{
				mp3: "'.$mp3.'"
			}, {
				cssSelectorAncestor: "#cp_container_1",
				swfPath: "js",
				supplied: "mp3",
				wmode: "window"
			});
		});');
	if(User::isAdmin())
	{echo('function delMusic(id)
		{
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function()
		{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			window.location.href="music.php";
			return;
		}
		}
		xmlhttp.open("POST","./music_op.php",true);
		xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		xmlhttp.send("mode=dels&id="+id);
		}');
	}
	echo('</script>');
 ?>
	</head>
	<body>

		<!-- The jPlayer div must not be hidden. Keep it at the root of the body element to avoid any such problems. -->
		<div id="jquery_jplayer_1" class="cp-jplayer"></div>

		<div class="prototype-wrapper"> <!-- A wrapper to emulate use in a webpage and center align -->
			<!-- The container for the interface can go where you want to display it. Show and hide it as you need. -->
			<div class="desc"><?php echo($name);?></div>
			<div id="cp_container_1" class="cp-container">
				<div class="cp-buffer-holder"> <!-- .cp-gt50 only needed when buffer is > than 50% -->
					<div class="cp-buffer-1"></div>
					<div class="cp-buffer-2"></div>
				</div>
				<div class="cp-progress-holder"> <!-- .cp-gt50 only needed when progress is > than 50% -->
					<div class="cp-progress-1"></div>
					<div class="cp-progress-2"></div>
				</div>
				<div class="cp-circle-control"></div>
				<ul class="cp-controls">
					<li><a href="#" class="cp-play" tabindex="1">play</a></li>
					<li><a href="#" class="cp-pause" style="display:none;" tabindex="1">pause</a></li> <!-- Needs the inline style here, or jQuery.show() uses display:inline instead of display:block -->
				</ul>
			</div>
			<?php
				echo('<div class="desc">歌手：<a href="singer.php?id='.$sid.'" class="alume">'.$singer.'</a></div>');
				echo('<div class="desc">专辑：<a href="alume.php?id='.$aid.'" class="alume">'.$alume.'</a></div>');
				if(User::isAdmin()){echo('<a href="#" onclick="delMusic('.$id.')">删除</a>');}
			?>
		</div>
	</body>
</html>