{{
	$.ui.titleBar.textContent = it.items.title;

	var bb = $("#backButton")[0];
	bb.href=it.items.purl;
	bb.innerHTML= it.items.ptitle;
	bb.style.visibility = 'visible';
	$("#menubadge")[0].style.float = 'right';
}}
<div class="main-content">
	{{ if(it.items.mp3){}}
	<div class="button-grouped flex">
		<a class="button" href="javascript:void(0)" onclick="audioPlayer.setAudio('{{=it.items.title}}','http://media.cathassist.org/bible/mp3{{=it.items.mp3}}',true,getAudioBibleNext,'{{=it.items.mp3}}');">播放本章音频</a>
	</div>
	{{}}}
	<p class="bc">
		{{=it.items.text}}
	</p>
</div>
