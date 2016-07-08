var cookie = require('./lib/cookie');
var events = require('./helpers/events');
var selectors = require('./helpers/selectors');
var dom = require('./helpers/dom');

var $ = selectors.$;
var $c = selectors.$c;

function vv(e,min,max,evt,r)  {  //Field Value Validation (numeric only)
	if (r != undefined && $('act-'+r).checked == 0) { row_act(r); }
	if ($(e).title == '') {
		$(e).autocomplete = 'off';
		$(e).title = '('+min+' - '+max+') Use up/down arrow keys to increase/decrease.';
	}
	var r = $(e).id.split('-')[1], v = $(e).value;
	var k = window.event?event.keyCode:evt.keyCode; // alert(k); //DEBUG
	switch(k) {
		case 9: return false; break; //tab
		case 8: return false; break; //backspace
		case 46: return false; break; //delete
		case 13: calc_ivs((mode==2 && act>-1?act:0)); break; //enter
		case 38: //Up key, increase
			$(e).value = v<max?(1*v)+1:v;
		break;
		case 40: //Down key, decrease
			$(e).value = v>min?(1*v)-1:v;
		break;
		default:
			$(e).value = isNaN(v)?min:Math.min(v,max);
	}
}

// TODO: Replace this with css3 tooltips
function tooltips() { // inspired by http://qrayg.com/learn/code/qtip
	if (!$('tooltip')) { var e = el_add($('calculator'),'div',{className:'a',id:'tooltip'});
		events.add(document, "mousemove", function(evt) {
			var de = document.documentElement;
			$('tooltip').style.left = (document.all?((de && de.scrollLeft)?de.scrollLeft:document.body.scrollLeft)+window.event.clientX:evt.pageX)+'px';
			$('tooltip').style.top = (document.all?((de && de.scrollTop)?de.scrollTop:document.body.scrollTop)+window.event.clientY:evt.pageY)+'px';
		});
	}
	var elements = $c('tooltip');
	var  i=elements.length-1; do {
		var e = elements[i];
				if(e.title && !e.tooltip) {
					e.tooltip = e.title;
					e.title = ''; e.alt = ''; //prevent default behaviour
					events.add(e, "mouseover", function() { $('tooltip').innerHTML = this.tooltip; $('tooltip').style.display = 'block'; });
					events.add(e, "mouseout", function() { $('tooltip').innerHTML = ''; $('tooltip').style.display = 'none'; });
				}
	} while(i--);
}
function el_add(el,tag,attr,txt) { //Appends element - el_add(el,'div',{className:'a',id:'b'},'text');
	var i='',e=document.createElement(tag);
	if (attr) {
		for (i in attr) {
			e[i] = attr[i];
		}
	}
	e.innerHTML = txt || '';
	el.appendChild(e);
	return e;
}
function el_del(el) { //Removes all element children of el
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
	return this;
}
function array_intersect(a, b) { //arrays must be sorted, a and b are destructed afterwards
	var r=[];
	while( a.length > 0 && b.length > 0 ) {
		if (a[0] < b[0] ){ a.shift(); }
		else if (a[0] > b[0] ){ b.shift(); }
		else {
			r.push(a.shift());
			b.shift();
		}
	}
	return r;
}
if (!Array.prototype.map) {
	Array.prototype.map = function(fn, thisObj) { // http://www.dustindiaz.com/basement/sugar-arrays.html
		var scope = thisObj || window;
		var a = [];
		for (var i=0, j=this.length; i < j; ++i) {
			a.push(fn.call(scope, this[i], i, this));
		}
		return a;
	};
}
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(el, start) { // http://www.dustindiaz.com/basement/sugar-arrays.html
		var start = start || 0;
		for (var i=0, j=this.length; i < j; ++i) { //rewrite using while do?
			if (this[i] === el ) {
				return i;
			}
		}
		return -1;
	};
}
Array.prototype.sum = function() {
	var sum=0,i=this.length-1; do {
		sum += this[i];
	} while(i--);
	return sum;
};
Array.prototype.sortnum = function() {
   return this.sort( function (a,b) { return a-b; } );
};
Array.prototype.style = function(p,v) {
	var i=this.length-1; do {
		this[i].style[p] = v;
	} while(i--);
};

/* Pokemon Data and retrieval functions */
//Pokemon Name:Number - email the author for a precompiled list of the names in other languages
pkmns='Bulbasaur:1|Ivysaur:2|Venusaur:3|Charmander:4|Charmeleon:5|Charizard:6|Squirtle:7|Wartortle:8|Blastoise:9|Caterpie:10|Metapod:11|Butterfree:12|Weedle:13|Kakuna:14|Beedrill:15|Pidgey:16|Pidgeotto:17|Pidgeot:18|Rattata:19|Raticate:20|Spearow:21|Fearow:22|Ekans:23|Arbok:24|Pikachu:25|Raichu:26|Sandshrew:27|Sandslash:28|Nidoran♀:29|Nidorina:30|Nidoqueen:31|Nidoran♂:32|Nidorino:33|Nidoking:34|Clefairy:35|Clefable:36|Vulpix:37|Ninetales:38|Jigglypuff:39|Wigglytuff:40|Zubat:41|Golbat:42|Oddish:43|Gloom:44|Vileplume:45|Paras:46|Parasect:47|Venonat:48|Venomoth:49|Diglett:50|Dugtrio:51|Meowth:52|Persian:53|Psyduck:54|Golduck:55|Mankey:56|Primeape:57|Growlithe:58|Arcanine:59|Poliwag:60|Poliwhirl:61|Poliwrath:62|Abra:63|Kadabra:64|Alakazam:65|Machop:66|Machoke:67|Machamp:68|Bellsprout:69|Weepinbell:70|Victreebel:71|Tentacool:72|Tentacruel:73|Geodude:74|Graveler:75|Golem:76|Ponyta:77|Rapidash:78|Slowpoke:79|Slowbro:80|Magnemite:81|Magneton:82|Farfetch’d:83|Doduo:84|Dodrio:85|Seel:86|Dewgong:87|Grimer:88|Muk:89|Shellder:90|Cloyster:91|Gastly:92|Haunter:93|Gengar:94|Onix:95|Drowzee:96|Hypno:97|Krabby:98|Kingler:99|Voltorb:100|Electrode:101|Exeggcute:102|Exeggutor:103|Cubone:104|Marowak:105|Hitmonlee:106|Hitmonchan:107|Lickitung:108|Koffing:109|Weezing:110|Rhyhorn:111|Rhydon:112|Chansey:113|Tangela:114|Kangaskhan:115|Horsea:116|Seadra:117|Goldeen:118|Seaking:119|Staryu:120|Starmie:121|Mr. Mime:122|Scyther:123|Jynx:124|Electabuzz:125|Magmar:126|Pinsir:127|Tauros:128|Magikarp:129|Gyarados:130|Lapras:131|Ditto:132|Eevee:133|Vaporeon:134|Jolteon:135|Flareon:136|Porygon:137|Omanyte:138|Omastar:139|Kabuto:140|Kabutops:141|Aerodactyl:142|Snorlax:143|Articuno:144|Zapdos:145|Moltres:146|Dratini:147|Dragonair:148|Dragonite:149|Mewtwo:150|Mew:151|Chikorita:152|Bayleef:153|Meganium:154|Cyndaquil:155|Quilava:156|Typhlosion:157|Totodile:158|Croconaw:159|Feraligatr:160|Sentret:161|Furret:162|Hoothoot:163|Noctowl:164|Ledyba:165|Ledian:166|Spinarak:167|Ariados:168|Crobat:169|Chinchou:170|Lanturn:171|Pichu:172|Cleffa:173|Igglybuff:174|Togepi:175|Togetic:176|Natu:177|Xatu:178|Mareep:179|Flaaffy:180|Ampharos:181|Bellossom:182|Marill:183|Azumarill:184|Sudowoodo:185|Politoed:186|Hoppip:187|Skiploom:188|Jumpluff:189|Aipom:190|Sunkern:191|Sunflora:192|Yanma:193|Wooper:194|Quagsire:195|Espeon:196|Umbreon:197|Murkrow:198|Slowking:199|Misdreavus:200|Unown:201|Wobbuffet:202|Girafarig:203|Pineco:204|Forretress:205|Dunsparce:206|Gligar:207|Steelix:208|Snubbull:209|Granbull:210|Qwilfish:211|Scizor:212|Shuckle:213|Heracross:214|Sneasel:215|Teddiursa:216|Ursaring:217|Slugma:218|Magcargo:219|Swinub:220|Piloswine:221|Corsola:222|Remoraid:223|Octillery:224|Delibird:225|Mantine:226|Skarmory:227|Houndour:228|Houndoom:229|Kingdra:230|Phanpy:231|Donphan:232|Porygon2:233|Stantler:234|Smeargle:235|Tyrogue:236|Hitmontop:237|Smoochum:238|Elekid:239|Magby:240|Miltank:241|Blissey:242|Raikou:243|Entei:244|Suicune:245|Larvitar:246|Pupitar:247|Tyranitar:248|Lugia:249|Ho-oh:250|Celebi:251|Treecko:252|Grovyle:253|Sceptile:254|Torchic:255|Combusken:256|Blaziken:257|Mudkip:258|Marshtomp:259|Swampert:260|Poochyena:261|Mightyena:262|Zigzagoon:263|Linoone:264|Wurmple:265|Silcoon:266|Beautifly:267|Cascoon:268|Dustox:269|Lotad:270|Lombre:271|Ludicolo:272|Seedot:273|Nuzleaf:274|Shiftry:275|Taillow:276|Swellow:277|Wingull:278|Pelipper:279|Ralts:280|Kirlia:281|Gardevoir:282|Surskit:283|Masquerain:284|Shroomish:285|Breloom:286|Slakoth:287|Vigoroth:288|Slaking:289|Nincada:290|Ninjask:291|Shedinja:292|Whismur:293|Loudred:294|Exploud:295|Makuhita:296|Hariyama:297|Azurill:298|Nosepass:299|Skitty:300|Delcatty:301|Sableye:302|Mawile:303|Aron:304|Lairon:305|Aggron:306|Meditite:307|Medicham:308|Electrike:309|Manectric:310|Plusle:311|Minun:312|Volbeat:313|Illumise:314|Roselia:315|Gulpin:316|Swalot:317|Carvanha:318|Sharpedo:319|Wailmer:320|Wailord:321|Numel:322|Camerupt:323|Torkoal:324|Spoink:325|Grumpig:326|Spinda:327|Trapinch:328|Vibrava:329|Flygon:330|Cacnea:331|Cacturne:332|Swablu:333|Altaria:334|Zangoose:335|Seviper:336|Lunatone:337|Solrock:338|Barboach:339|Whiscash:340|Corphish:341|Crawdaunt:342|Baltoy:343|Claydol:344|Lileep:345|Cradily:346|Anorith:347|Armaldo:348|Feebas:349|Milotic:350|Castform:351|Kecleon:352|Shuppet:353|Banette:354|Duskull:355|Dusclops:356|Tropius:357|Chimecho:358|Absol:359|Wynaut:360|Snorunt:361|Glalie:362|Spheal:363|Sealeo:364|Walrein:365|Clamperl:366|Huntail:367|Gorebyss:368|Relicanth:369|Luvdisc:370|Bagon:371|Shelgon:372|Salamence:373|Beldum:374|Metang:375|Metagross:376|Regirock:377|Regice:378|Registeel:379|Latias:380|Latios:381|Kyogre:382|Groudon:383|Rayquaza:384|Jirachi:385|Deoxys:386|Turtwig:387|Grotle:388|Torterra:389|Chimchar:390|Monferno:391|Infernape:392|Piplup:393|Prinplup:394|Empoleon:395|Starly:396|Staravia:397|Staraptor:398|Bidoof:399|Bibarel:400|Kricketot:401|Kricketune:402|Shinx:403|Luxio:404|Luxray:405|Budew:406|Roserade:407|Cranidos:408|Rampardos:409|Shieldon:410|Bastiodon:411|Burmy:412|Wormadam .Plant:413|Mothim:414|Combee:415|Vespiquen:416|Pachirisu:417|Buizel:418|Floatzel:419|Cherubi:420|Cherrim:421|Shellos:422|Gastrodon:423|Ambipom:424|Drifloon:425|Drifblim:426|Buneary:427|Lopunny:428|Mismagius:429|Honchkrow:430|Glameow:431|Purugly:432|Chingling:433|Stunky:434|Skuntank:435|Bronzor:436|Bronzong:437|Bonsly:438|Mime Jr.:439|Happiny:440|Chatot:441|Spiritomb:442|Gible:443|Gabite:444|Garchomp:445|Munchlax:446|Riolu:447|Lucario:448|Hippopotas:449|Hippowdon:450|Skorupi:451|Drapion:452|Croagunk:453|Toxicroak:454|Carnivine:455|Finneon:456|Lumineon:457|Mantyke:458|Snover:459|Abomasnow:460|Weavile:461|Magnezone:462|Lickilicky:463|Rhyperior:464|Tangrowth:465|Electivire:466|Magmortar:467|Togekiss:468|Yanmega:469|Leafeon:470|Glaceon:471|Gliscor:472|Mamoswine:473|Porygon-Z:474|Gallade:475|Probopass:476|Dusknoir:477|Froslass:478|Rotom:479|Uxie:480|Mesprit:481|Azelf:482|Dialga:483|Palkia:484|Heatran:485|Regigigas:486|Giratina .Altered:487|Cresselia:488|Phione:489|Manaphy:490|Darkrai:491|Shaymin .Land:492|Arceus:493|Victini:494|Snivy:495|Servine:496|Serperior:497|Tepig:498|Pignite:499|Emboar:500|Oshawott:501|Dewott:502|Samurott:503|Patrat:504|Watchog:505|Lillipup:506|Herdier:507|Stoutland:508|Purrloin:509|Liepard:510|Pansage:511|Simisage:512|Pansear:513|Simisear:514|Panpour:515|Simipour:516|Munna:517|Musharna:518|Pidove:519|Tranquill:520|Unfezant:521|Blitzle:522|Zebstrika:523|Roggenrola:524|Boldore:525|Gigalith:526|Woobat:527|Swoobat:528|Drilbur:529|Excadrill:530|Audino:531|Timburr:532|Gurdurr:533|Conkeldurr:534|Tympole:535|Palpitoad:536|Seismitoad:537|Throh:538|Sawk:539|Sewaddle:540|Swadloon:541|Leavanny:542|Venipede:543|Whirlipede:544|Scolipede:545|Cottonee:546|Whimsicott:547|Petilil:548|Lilligant:549|Basculin .Red:550|Sandile:551|Krokorok:552|Krookodile:553|Darumaka:554|Darmanitan:555|Maractus:556|Dwebble:557|Crustle:558|Scraggy:559|Scrafty:560|Sigilyph:561|Yamask:562|Cofagrigus:563|Tirtouga:564|Carracosta:565|Archen:566|Archeops:567|Trubbish:568|Garbodor:569|Zorua:570|Zoroark:571|Minccino:572|Cinccino:573|Gothita:574|Gothorita:575|Gothitelle:576|Solosis:577|Duosion:578|Reuniclus:579|Ducklett:580|Swanna:581|Vanillite:582|Vanillish:583|Vanilluxe:584|Deerling:585|Sawsbuck:586|Emolga:587|Karrablast:588|Escavalier:589|Foongus:590|Amoonguss:591|Frillish:592|Jellicent:593|Alomomola:594|Joltik:595|Galvantula:596|Ferroseed:597|Ferrothorn:598|Klink:599|Klang:600|Klinklang:601|Tynamo:602|Eelektrik:603|Eelektross:604|Elgyem:605|Beheeyem:606|Litwick:607|Lampent:608|Chandelure:609|Axew:610|Fraxure:611|Haxorus:612|Cubchoo:613|Beartic:614|Cryogonal:615|Shelmet:616|Accelgor:617|Stunfisk:618|Mienfoo:619|Mienshao:620|Druddigon:621|Golett:622|Golurk:623|Pawniard:624|Bisharp:625|Bouffalant:626|Rufflet:627|Braviary:628|Vullaby:629|Mandibuzz:630|Heatmor:631|Durant:632|Deino:633|Zweilous:634|Hydreigon:635|Larvesta:636|Volcarona:637|Cobalion:638|Terrakion:639|Virizion:640|Tornadus:641|Thundurus:642|Reshiram:643|Zekrom:644|Landorus:645|Kyurem:646|Keldeo .Ordinary:647|Meloetta .Aria:648|Genesect:649|Chespin:650|Quilladin:651|Chesnaught:652|Fennekin:653|Braixen:654|Delphox:655|Froakie:656|Frogadier:657|Greninja:658|Bunnelby:659|Diggersby:660|Fletchling:661|Fletchinder:662|Talonflame:663|Scatterbug:664|Spewpa:665|Vivillon:666|Litleo:667|Pyroar:668|Flabébé:669|Floette:670|Florges:671|Skiddo:672|Gogoat:673|Pancham:674|Pangoro:675|Furfrou:676|Espurr:677|Meowstic ♂:678|Honedge:679|Doublade:680|Aegislash:681|Spritzee:682|Aromatisse:683|Swirlix:684|Slurpuff:685|Inkay:686|Malamar:687|Binacle:688|Barbaracle:689|Skrelp:690|Dragalge:691|Clauncher:692|Clawitzer:693|Helioptile:694|Heliolisk:695|Tyrunt:696|Tyrantrum:697|Amaura:698|Aurorus:699|Sylveon:700|Hawlucha:701|Dedenne:702|Carbink:703|Goomy:704|Sliggoo:705|Goodra:706|Klefki:707|Phantump:708|Trevenant:709|Pumpkaboo .Average:710|Gourgeist .Average:711|Bergmite:712|Avalugg:713|Noibat:714|Noivern:715|Xerneas:716|Yveltal:717|Zygarde:718|Diance:719|Volcanion:720|Hoopa:721|Deoxys_ATK:386.1|Deoxys_DEF:386.2|Deoxys_SPD:386.3|Wormadam_Sandy:413.1|Wormadam_Trash:413.2|Shaymin_Sky:492.1|Giratina_Origin:487.1|Rotom_Heat:479.1|Rotom_Wash:479.2|Rotom_Frost:479.3|Rotom_Fan:479.4|Rotom_Mow:479.5|Castform_Sun:351.1|Castform_Rain:351.2|Castform_Snow:351.3|Basculin_Blue:550.1|Darmanitan_Zen:555.1|Meloetta_Pirouette:648.1|Kyurem_White:646.1|Kyurem_Black:646.2|Keldeo_Resolute:647.1|Tornadus_Therian:641.1|Thundurus_Therian:642.1|Landorus_Therian:645.1|Floette_Eternal:670.1|Meowstic_:678.1|Aegislash_Blade:681.1|Pumpkaboo_Small:710.1|Pumpkaboo_Large:710.2|Pumpkaboo_Huge:710.3|Gourgeist_Small:711.1|Gourgeist_Large:711.2|Gourgeist_Huge:711.3|Venusaur_Mega:3.1|Charizard_Mega_:6.1|Charizard_Mega_:6.2|Blastoise_Mega:9.1|Alakazam_Mega:65.1|Gengar_Mega:94.1|Kangaskhan_Mega:115.1|Pinsir_Mega:127.1|Gyarados_Mega:130.1|Aerodactyl_Mega:142.1|Mewtwo_Mega_:150.1|Mewtwo_Mega_:150.2|Ampharos_Mega:181.1|Scizor_Mega:212.1|Heracross_Mega:214.1|Houndoom_Mega:229.1|Tyranitar_Mega:248.1|Blaziken_Mega:257.1|Gardevoir_Mega:282.1|Mawile_Mega:303.1|Aggron_Mega:306.1|Medicham_Mega:308.1|Manectric_Mega:310.1|Banette_Mega:354.1|Absol_Mega:359.1|Latias_Mega:380.1|Latios_Mega:381.1|Garchomp_Mega:445.1|Lucario_Mega:448.1|Abomasnow_Mega:460.1';

//Compressed Pokemon data: HP/ATK/DEF/SP.ATK/SP.DEF/SPD/Type1/Type2/Egg1/Egg2/EPs2/EPs1 - national order + forms
pkmn='            3tt//3.*#< #&SP00&.*#< !0sX440.*#< 9λY^&(/;;#AB QBQ0/0;;#AB#VwVα84;)#A *TJ/(B^""#)> kP0/0Q""#)>$aX48CV""#) 73?@II399**# (I1MM?99**G &3(50+9)** 92@?II(9***B 3M(MM@9***G /523069***-$232@@_ )$$B P&1((e )$$F X06++ε )$$z ?_@M@R  !!B 1m&(+y  !!F 2&?φφ+ )$$B /5/dd4 )$$F @&T2x1**!A$ &8l/a0**!A- @12((577!9F &5150D77!9z (68I?2$$!!> 64D31/$$!!G 1βY22q**#!# +SW11_**,,) 5iγ68]*$,,* %j222(**#!$ dRj11/**#!- mψ[868*$#!7 +3J&/@HH99) :+g:5&HH99* nq2(//;;!!B g]6m44;;!!B$L3I3MI H99) c+38(3 H99* 23@?21*)$$B 60+/65*)$$F 3(16/?.*<< #&/+862.*<< )608D5(.*<< *@+131M9.*<$ &:0&0?9.*<ο &1(2139*** $+/&5659***B#"1M@3:$$!!B @0((+E$$!!F 23@225  !!B /+&//L  !!F (YJ/(1"")! #0sV:08"")! )20@@3+##!!$ /C&&+:##!!- 1+3+(&;;!!$ 5D040:;;!!- 2(2225""))B ///((5""))F 5::+5+"#))J MI,C15==-- #2@?E+C==-- )1(3b:E==-- *+0(@@@##--$ 04+(&3##--- 5K0/81##--7 (6@+?2.*<<$ /5(831.*<<- 0C/4++.*<<7 22@(4+"*;; $0+/0E4"*;; -204??I!$""> 1:L33@!$""G 0EK1/3!$""J (81//5;;!!B /4+00C;;!!F 5//22,"=#)# :6D40?"=#)G M@+:137-"" #(&:E++7-"" )Y/1QS& )$!$ @83@@6 )$$$ &D+&&4 )$$- /313+3"")! $5+0+:+"A)! -00(2(M**..# CC6/4(**..! ?/43M2"";;> (:Γ83+"A;;G ?@?4@0<*.. #3(3L1:<*.. )&/&K6D<*.. *@3θ?3+!$""> &J3^5f==-- $8g+gLW==-- -?C5MM("";;$ 1KL((6"";;- 2?(11477""B &(+00c77""F &20&32.=<<> ::8N/1.=<< )((:2(@$$##> &0D(03$$##G (Eh@Dγ##--- (Ca@D]##-- -516&6?  ##) 2/:&3@**..> /5E8+&**..G 08:??M$!#!> CKE332$!#!- ά!!@C(  99) /1L42&..<<> C:0205  ##) ?2++M&"")A #1/::38"")A>#3W&@(P""77$ 0i//0U""77- ?31+18"";;B &6848L"=;;F 23/4E5=H-- -+D010C9)**$ /(@L::A=-- )/Xj:8C77--F /:j48Θ;;-- )/N41+899**- 64:2+D  !!U I"1,I0""7AB :Na&4m")7A- K808:&"A#)) JJJJJJ  ==# 11(3/1  !! $K/&D:/""!!) //&D:K77!!F /K&:D/;;!!- /&+862  "" #@2451@!");> +&NL+1!");G ?05131!");> &LC/+0!");- 0C/&6K!)$$F θD//D?  ##) 584:N8A),, 7558N547),, *545N85;),, *qB3(((,,)A$ dw/+++,,)A- oΤ:440,))A7 {D5Ζ5K==,, *444444==,,* 3t/t/3..#< $&S0P0&..#<>$0s4X40..#<>-λY^&(/;;!!B QBQ0/0;;!!B#VwVα84;;!! *(/BTJ^""#)$ /00kPQ""#)I 8C4aXV""#)ο @%χ@3I  !!$ 8]B315  !!F &??}_( )$$# 4((]Υ+ )$$) 2I?2019)** $1@(1D89)** -2&222?9***$ +5+&&29***- 850+0K*)$$z 6nn__W"777# NQQ]]W"777) I2,@@&77,,B (Mυ31,HH,, $5?,2I, H,,# @I/2/IHH,, $1280C2H)$9 -2(3+3+=)$$ #/6+:+:=)$$B#122/3@77#! #+110&377#! )568L5177#! *60:54(..<< 7+I(I(2"H)9) 4(0&0("H)9* +4L?/?!!""G 56654+"")) 7@@2@1(.)9< $13(3/0.)9<F 61+1:D.)9<z 1+1218  !!B ??????..<< #661C8?..<< )//363:9)**B 133MM,"$)!# :88//@"$)!) //&K:D==!! ):/D&K/>>!! -&8f8fo>)$$B :604D?"=#) 7&&&888<<.. $JRJRJJ==,,$#ςτQτQτ==..) +0/5/8 =!! )(/5@@,99**> 65c&&29-**G 4++//3  !!# /6C@/8$)**> 68Λ1/?-$""G &0(22?HH!9$ 5E6&&3HH!9- /:6118"*77$ +K410/9-**- I"Ρ"Ρ!9!**>$0N62:89#**- 1:1@6L>A!!B &0(((2  !!$ 5K6661  !!- 222+2I;;.. #((E00?;!..G ((2??(A$!!$ 440&&(A$!!! 118/8@"!);>$@/@/@/"")7 #6C6C63"")7$#313/36A))!B /2+0c+"))) -/0c2++-)$$G 3&?0(/>;!! #65(D0:>;!! )6::::8",)A$!5&&222$$!!# 5EE&&($$!!I 805C:&  "" )g:S8/8  !!$ 1I@I36  !!B @@@@@@##,,$ (::@D+##-- -3?,8//A=,, #3P|/1:77,,B 36|+1X;;,,B :0C2+4  !!G έ""6b1  99* 586L4L77,,F#LL8564;;,,; 46L5L8"",,>-(B(3(q!$##$ +w+/+δ!$##- 4ΤD:4d!>##7 {5K5ΖD=),, 7{K5DΖ5;),, 7444444=.,,* 23@/1+..#AB (/38/:..#AF +8/C8E..#Az 3&2+(3;;!! #&8&8&1;#!!$#0E+D+0;#!!7 (+(((2""#)$ +8+&+("$#)- 4D585&"$#)7 @1@??@>>!!$ +5+&&+>>!!- n?q?q&  !!B V+d(d4  !!F 33@I?I99**# (@1MM,99**G &+(4(/9)** *(@1MM,99**G &(+(5/9*** 72??2(?".)< $&((&+(".)< -0++54+".)< 722(???..!<> ++2&2&.>!<- 54&5&0.>!<7 21???8 )$$B &8&((N )$$F 2??1?8"))$B &(48+/"))$G υMM3@2=H.. #n@@/1(=H.. )U//NL0=H.. *2?G(Y/9")*B +&S0s&9))* !&2&2&@..9<# &K0&&+.#9<- &&&@@?  !!# 000115  !!F Oθ4:/4  !!* φ35??29$**> d53((θ9)**F #53??29<"") Bδκδκυ  #!# we^e^J  #!) νoPogU  #!* R&?I?M##--# ήE&2&(##--) (I2I2I H,,# ?3b35?!!""> (33@@(  !9B +//11+  !9/ (66//(><--I (8811(-H!9I (+422?-!##> &5c((2-!##G +DΓ&&(-!##J ?2121&#=--B &&6&60#=--F 232/2/77!!B +6&C&C77!!F &(286:7799B &2(68:7799B /g1β6899*-B /β1g6899*-B (&340/.*9< )+^h^h2**..# 4gXgX1**..) 35I/I/">77$ +E2:2:">77- K+@+@&""!7# Ι5353&""!7) &&2/3@;$!! #+4+C62;$!!$#+8c8+I;;!!G &M@+0&==!! $03/5D0==!! -&&&&&&  !- #34333"$$**$ (+(((+$,**U 040004$,**Σ (8282@..<- #+L&L&1.><-$#32&26( )$A $6+5+C0,)$A -gL&&&5  !!- g4&4&/**!A$#+1/:8+!="" )+:81/+!=""- (J^%q&"$77# DVg]e&"$77) ^0/(@@"");$ PE8511">);- 2212+1$="" $&+C+E6$="" -`q[dγκ!.;; $Zmymu^!.;; -3:(2(6!9;;$ 6N4+03!9;;- I,I"10"")AB :&a4Nm"")A -++++++  9.# &5+&E2  !! $T6@Pτ3<<..$ BL/XP/<<..- I25?5M<<.. $2+K&KM<<..>$ζUXRγδ.)#<) /(+:0/==.. !/K&6&6>>!!- :κJκJκ==,,# ((((((AA9"# 000000AA9") +2(1(MA")!# 5&+6+3A")!) D05:5/A")!* @B8p1G""))> 1νCΑ6Y""))I 1wCΚ6Y"")) )45K3/1"!)7H ^?12/y""77B 36&2?(,,AA$ /:4&((,,AAG :b0D04,)AA7 210@&?-=""> &6410(-=""G 0bK:5+-=""J 04Λ(4(!!,,J 0(44Λ(AA,, 706O6O(--,,G$005DKD,=,, 7050KDD,=,, *445Oc5"",, *4Oc455$$,,7 CO5O5:,),,-#444444-=,,* (O(O(O==,,U#1UB31φ..#<$ 6~81/}..#<I :αC68_.$#<ο TQTQTd;;!-B BVYVYm;#!-B#]νeνer;#!-U#hδhd_2"")! #B`Um]("")! )wZιΕε&"-)! *21???& )$$B 16(220 )$$F 8E+(&4 )$$7 k32@2φ  )!# a8&1&e ")!- |MqMqM99**> [8δ1δ/99**- 3/χ2χ377!!$ &8t&t&77!!- 0Ea:a+77!!7 2?@(+1.*,, #&+/NC5.*9< *WN2??Q!!##$ yΗ&/(Q!!##- ?fΝfι?!-##> &Yίβό?!-##G 2ω3ω3}99** $&k8aC}9.** -+Α(Α(`9)**$#??f?f+9)**B +0ψ0ψ29)**>$&3+35:77!9B 1/@&?8"")!B 8C18(L"")!F 3@3Sh@..9< #+&+γV8..9< )]JJjSχ"").# ΕXUisλ"$).) 64`&`L  !!F 5(χ&T+<)..# O0T5x0<)..) 1`TT_8  !-B /]wxΥC  !-F &&&CCC<<.. !4NYCYe>)$$- t1ff|8  !!B esBBkξ  !!F 3?(/(3==,, #PPβqqp*>!!B ηΘWedw*>!!) jοZοZκ-=""> W~πaπτ-="">$(0:"3"!!,,> IM3+5&=H,, $4!!,/?  ,,# ]/3ifo )$$$ (irir@<>..>$Q+323f,$#A$ U5/(1s,$#A- rK:08ψ,$#A7 b8228!  ,,# 2+2@2&##,,$ +D+L+5#-!-$#URVnfG$$!!> rξΝURβ$$!!G 2(5?1/*9*;> +5D&6:*>*;G Jd2d2(*#--$ X{/Z/8*#--- p4R5R%..<<- tt_td`""77B ll]lZo""77F 3I(&E("),, $&S(S&2.A#<$ 5i6i8&.A#<$#+E/38N>A!!U ++LK5&7-"" *D8:0:(  ##* LcK112$!#!7 44ND((..<<G 6μW:8:77--7 6:WN:X;;-- *8(:EL0H)$9 9Z]Zπ_:9)**- /DK&/:..!!G /&DK:/AA!! )6:N36:$)**G DK0+&0A$!!7 80+b65  "" *UN//L0=#..7 &1σ6O2!-"">-34b/b3<<..>-+0+0+DA<9"F (([:[o7<..B#66K6K:==,,G$0CCCC0==,,$!6N+N+L==,,-#4EEO45-,,, *5E4OE4",,, *o5{K{[;-,, *DθD0D4  ,,7 O4E4E5<,,,* E+E6K8==,, 7000000"")9# 444444"")9* +55b5N>>,,B)444444..,,* EEEEEE  ,,* 444444=;,,* 33131P..!<B &&6&6X..!<F 66:6:Ψ..!<z /P3333;;!!# 5Θ1+11;#!!- Dμ/4//;#!!7 113P33""!! #66&X&&""!! ):48r++""!! *31λ@λf  !!$ &8l&l[  !!- 3&3M31  !!$ /0/@/&  !!- 8D5350  !!7 q(|(|`>>!!B Bι(ι({>>!!F (hJhJB..!!B 6vPvPε..!!F (hJhJB;;!!B 6vPvPε;;!!F (hJhJB""!!B 6vPvPε""!!F ]M3W1ο==!!# π18u:ω==!!) (1(}?^ )$$$ S[S(f/ )$$- 0L0/1Θ )$$7 3&G(G]77!!B 64P0Pπ77!!F 168MM,!!""> +CC(2I!!""I 8bK&0M!!""7 13^1^R=)!$B Wj1[1Κ=)!$F &82?3U$$!!$ Db&(/ι$-!!- η&Z&Z(  99) 601M@@##--$ 8C82(2##--- Cc:1/3##--7 ((2(2B""))B 6/1/1l"$))) C:686p"$))* E48?83##--) 6N6?68##--- 3h+2&f9.**> 1P5(0f9.**G 6η0+0i9.**7 ?3k?λj9***> 21ζ2aβ9***G &4~1lξ9***z 2Μ&|(`.H<9B &W8[6π.H<9F 3@(+(?..<< #+&6D65..<< )+i/01v""77F (R@@@/$>!!$ &s333p$>!!- :Ξ0/+i$>!!7 +53,3(;;!!$ Cc1?1:;;!!- 6ZW{W&..<< )(/8@@19!*"> +:N/639!*"G (6+@+J>#!A$ /5L3LQ>#!A>$RQ0η0y=)$$ )n?81/?<<".> Q(σ:C?<<".G xVηh3Φ"!);> prύX/G"!);G 1ξ3p3+!)$;$ 6c/ξ/D!)$;- ((S2S/**""B 0:s&s6**""- 2/202/>>!! #&C&E&C>>!! )1(2226  !!B 6:&/&L  !!F 3?(1/3==-- $&3+681==-- -+1::D/==-- 73?2C(I==.. #/2(N&?==.. )D/6N8?==.. *ST(T(1"))$# 6γPγPv"))$F }((/&TAA"" #δ//06kAA"" )e:8D:aAA"" *&&(2(6 .!!B 04+&+: .!!- 16&6&η7)!!F (6323&99**$ +bC&CI9-**- l1311,.*<<# Κ8+80?.*<<) 12(/82"<.. $4&+8C&"<.. -Η6023/"")7) (β(j(/97**B +[&y&r97**F T(oοZ".-<"> pΑΒxπI.-<"G 21+3&?--""> &0:+8(--""G &4L+85--""J @1232&77..B /8+6+277..- 8L0C0(77..7 11181?==-- #666N:2==-- )(?1/1I<;.. #&2&:&1<;.. )&15σ50<;.. *%γ&?2j,,#A$ `Ξ+2(W,,#A- ]ώ5&+y,,#A7 1+2&22AA!!$ :D0+0(AA!!- +(?:bCAA"" -(282/M99**> 0+24&σ99**F α`wmζG$7).) 38(1(/##!-$ /N&:&C##!-- [E5&5J,,A#- kp(@(@$<""$ ~Χ0101$<""- 38+22&>---$ /N4&++>---- :D:2:1  !!- +X(|(& )$$$ 4μ6j60 )$$- +163/&>)$$> D/C1:0>)$$ )8y`C`/;;!! )QαξJJα9-**G Y/(3(n>,AA$ R8+/+Q>,AA- iC5N5v>,AA *181(1&9;**$ 8&/bC49;** *o5Δ5Rr-#,,J oΔ5R5r!#,,7 o5R5Δr.#,, 7aL+N0Ε)),,7 aL+N0Ε7),,7 4E4OE5,;,, *4OEE45,7,,7 ~N5L0ε$),, *NK5K5:,A,,!#oR5Δ5r"#,, *4[[FF5 =,,B!eE:E:ζ9-,,U#_d/J3n..!!> dV:_Qj..!!G ιuρp6B.#!!J 232S&&;;!! #kkQ5+g;;!! )6lRΚ4ν;=!! *q_2STe""))B xPYX_y""))F R:Wηeρ">))z n}nG}j  !!B 8_[([V $!!) 3(^2nS )$$B Sg1_Yw;)$$B VmeplΟ;)$$F n@2ΜM@99**> 3Φ&Μ?ω99**> 0Y(5(~9)**> S(QgxR; !! #ZURα`{; !! )TnλdafHH99 $x3β6vYHH99 -V/UξΖ6HH99 7`/JSjY..!!# μ4SymU..!!) WsS%J^##!-$ :ΧVleQ#>!-- 60&/5ψ  !! $SJxP&U==!!B pJ]Xmν==!!F 304@|υ-<""G kDO3t@-<""G &(O(O&-<""J VY&P/κHH99# εRRζ~ωHH99) SJ`kjtHH99> s0Z86RHH99G hxh|%3>=)7$ ZiιU6g>=)7$ fYWλ_(!";;$ RCLxZU!";;- (&&&&?*")A #/65yμT*,)A )(hSQPT""); #egιE~k""); #Tnτd^+7 #AB S1YαΑα7 #AF Q~[33J!,#A$ sΠϊlke!,#A7 [k(WP%!A### μ[RζiQ!A##) ://DK&HH!! -Vi6pPΝ#)--- WQjmWε7H!9F ((O(O(!H9">$3(@162,,AA $U6hXΨ&,,AA -54+DO0,,AA 7j0o0γ6-H""> ^+J(&n<.<.$ 8D]/s_<.<.- t`+T1δ<...> /5ρQ6w<...G 1l8G@υAA##> :ΞϋT%υAA##G 2?@321),$$B 8+0y0μ),$$F ΟΒ:ΒvζHH,,* ΟΒ:Βvζ>),,* r4Πm::,$,,* (4O4O(!H,,  0DEK5+;",,  0D&OK+=<,,  (ΓIΓIO==,,-#(+θ+θ5==,,G$(:5:5Γ==,,z &aCk8}9$**G &l:l:}9-**>$4η6E6ΐ.),,z OE4E45<,,,* (/uCuZ7;..B#(/uCuZ7"..B#(/uCuZ7A..B#(/uCuZ7)..B#(/uCuZ7...B#++++++;;9.# ++++++""9.# ++++++AA9.# +i/01v""77F C?CcC1;=!! )4F5[[F #,,w NE5Ι4:,A,, *NΙ4E5:,A,,7 oR5Δ5r"#,, *a40D5Π)),,z aC+σ0ε7),, *~σ5C0o$),,7 p/WNFiHH,, -pJ]Xmν==!!F &O(O(&-<""J T`+T1_<...> x`+T1%<...> k`+T1q<...> 18ρQ6ζ<...> 6:ρQ6l<...> 84ρQ6x<...> 04μρE0.*#< 9VKΕK84;,#A *VνVàL4;)#A *aηEbLV""#) 71(/á:O==-- *&/0Ι:K<*.. *CN4&44  ##) /ΩE/5C9)**- :Ωα+Km">7A- 0b8+:O!)$$F {ς4Ζ4K=#,, *{O+âEc==,, *5:CΗD37,#! *+Oc/469-**- 0ãL2C69#**- 655c5L>;!! )4äO:Ee!>##7 0θ0K04;#!!7 U8/Ηb4=H.. *(CN1:(-H!9I +cΡ&0(--##J &48084#=--F +60b0b77!!F BΗ6ΘX6<<..- /O&L&L>>!!- 04EcOD,=,, 70K4θED,=,, *rΙLE:i,$#A7 +σιc+ξ#-!-$#5ΣCΣC?.A#<$#';
//Decompression Arrays
pk='00,05,0a,01,04,3c,32,02,03,46,0f,08,0b,41,50,37,28,2d,64,5a,4b,0c,55,06,5f,09,07,0d,10,1e,23,0e,40,69,6e,78,80,20,11,14,30,82,73,19,7d,96,3f,3a,48,3e,2c,44,4e,43,53,34,56,4d,4c,2b,38,42,4f,87,8c,3d,47,2a,49,35,5c,39,3b,45,51,26,5b,4a,29,6c,52,31,6b,62,54,36,61,c0,6a,25,24,59,2e,6d,2f,57,33,65,63,67,a0,58,17,27,7b,68,70,18,74,7a,91,21,1c,1f,22,66,1d,5e,83,b4,81,6f,9a,a5,5d,aa,72,c8,1b,76,75,7e,79,e6,84,86,60,16,7c,71,9b,be,fa,ff,90,a8,8a,85,93,77,b8,7f,9f,af,c2,b9,a4'; pk=pk.split(',');
mn=' !"#$&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~%αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩςάέήίόύώϊϋΐàáâãä'; mn=mn.split(''); base=[];

forms_after = 721;
forms = {386.1:722,386.2:723,386.3:724,413.1:725,413.2:726,492.1:727,487.1:728,479.1:729,479.2:730,479.3:731,479.4:732,479.5:733,351.1:734,351.2:735,351.3:736,550.1:737,555.1:738,648.1:739,646.1:740,646.2:741,647.1:742,641.1:743,642.1:744,645.1:745,670.1:746,678.1:747,681.1:748,710.1:749,710.2:750,710.3:751,711.1:752,711.2:753,711.3:754,3.1:755,6.1:756,6.2:757,9.1:758,65.1:759,94.1:760,115.1:761,127.1:762,130.1:763,142.1:764,150.1:765,150.2:766,181.1:767,212.1:768,214.1:769,229.1:770,248.1:771,257.1:772,282.1:773,303.1:774,306.1:775,308.1:776,310.1:777,354.1:778,359.1:779,380.1:780,381.1:781,445.1:782,448.1:783,460.1:784};

function get_base(p,s) { //Returns values from pkmn
	if (p.indexOf('.') > -1) {
		p = forms[p];
	}
	if (!base[p]) {
		base[p]=pkmn.slice(12*p,12*p+12).split('').map(function(v,i){v=pk[mn.indexOf(v)];if(i<10)v=parseInt(v,16);return v});
		base[p].push(('000000000000000'+parseInt(base[p].pop()+''+base[p].pop(),16).toString(2)).split('').reverse().join('').substr(0,12).split('').reverse().join('').match(new RegExp(".{1,"+2+"}", "g")).reverse().map(function (v) { return parseInt(v,2); }));
		base[p][10].push(base[p][10].splice(3,1)[0]);
	}
	return base[p][s];
}

//Add a custom Pokemon by modifying and un-commenting the following lines.
//Format is HP,ATK,DEF,SP.ATK,SP.DEF,SPD,Type1,Type2,Egg1,Egg2,[HP EPs,ATK EPs,DEF EPs,SP.ATK EPs,SP.DEF EPs,SPD EPs]
/*
pkmns = pkmns+'|Bulbasaur:1';
base[1] = [45, 49, 49, 65, 65, 45, 12, 3, 1, 7,[0, 0, 0, 1, 0, 0]];
*/

//ATK/DEF/SP.ATK/SP.DEF/SPD / Bashful 1, Docile 2, Hardy 3, Serious 4, Quirky 5, Bold 6, Modest 7, Calm 8, Timid 9, Lonely 10, Mild 11, Gentle 12, Hasty 13, Adamant 14, Impish 15, Careful 16, Jolly 17, Naughty 18, Lax 19, Rash 20, Naive 21, Brave 22, Relaxed 23, Quiet 24, Sassy 25
natures = [[],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[0.9,1.1,1,1,1],[0.9,1,1.1,1,1],[0.9,1,1,1.1,1],[0.9,1,1,1,1.1],[1.1,0.9,1,1,1],[1,0.9,1.1,1,1],[1,0.9,1,1.1,1],[1,0.9,1,1,1.1],[1.1,1,0.9,1,1],[1,1.1,0.9,1,1],[1,1,0.9,1.1,1],[1,1,0.9,1,1.1],[1.1,1,1,0.9,1],[1,1.1,1,0.9,1],[1,1,1.1,0.9,1],[1,1,1,0.9,1.1],[1.1,1,1,1,0.9],[1,1.1,1,1,0.9],[1,1,1.1,1,0.9],[1,1,1,1.1,0.9]];
natures[-1] = [1,1,1,1,1]; //neutral
natures['max'] = [1.1,1.1,1.1,1.1,1.1]; //all max
natures['min'] = [0.9,0.9,0.9,0.9,0.9]; //all max

//Type affinity no fg fl po gu ro bu gh st fi wa gs el ps ic dr da fa
damage = [[1,1,1,1,1,0.5,1,0,0.5,1,1,1,1,1,1,1,1,1],[2,1,0.5,0.5,1,2,0.5,0,2,1,1,1,1,0.5,2,1,2,0.5],[1,2,1,1,1,0.5,2,1,0.5,1,1,2,0.5,1,1,1,1,1],[1,1,1,0.5,0.5,0.5,1,0.5,0,1,1,2,1,1,1,1,1,2],[1,1,0,2,1,2,0.5,1,2,2,1,0.5,2,1,1,1,1,1],[1,0.5,2,1,0.5,1,2,1,0.5,2,1,1,1,1,2,1,1,1],[1,0.5,0.5,0.5,1,1,1,0.5,0.5,0.5,1,2,1,2,1,1,2,0.5],[0,1,1,1,1,1,1,2,1,1,1,1,1,2,1,1,0.5,1],[1,1,1,1,1,2,1,1,0.5,0.5,0.5,1,0.5,1,2,1,1,2],[1,1,1,1,1,0.5,2,1,2,0.5,0.5,2,1,1,2,0.5,1,1],[1,1,1,1,2,2,1,1,1,2,0.5,0.5,1,1,1,0.5,1,1],[1,1,0.5,0.5,2,2,0.5,1,0.5,0.5,2,0.5,1,1,1,0.5,1,1],[1,1,2,1,0,1,1,1,1,1,2,0.5,0.5,1,1,0.5,1,1],[1,2,1,2,1,1,1,1,0.5,1,1,1,1,0.5,1,1,0,1],[1,1,2,1,2,1,1,1,0.5,0.5,0.5,2,1,1,0.5,2,1,1],[1,1,1,1,1,1,1,1,0.5,1,1,1,1,1,1,2,1,0],[1,0.5,1,1,1,1,1,2,1,1,1,1,1,2,1,1,0.5,0.5],[1,2,1,0.5,1,1,1,1,0.5,0.5,1,1,1,1,1,2,2,1]];

ivr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];

stats = ['HP','Attack','Defense','Sp.Attack','Sp.Defense','Speed','&mdash;'];
types = ['Normal','Fighting','Flying','Poison','Ground','Rock','Bug','Ghost','Steel','Fire','Water','Grass','Electric','Psychic','Ice','Dragon','Dark','Fairy'];
eggs = ['???','Monster','Water1','Bug','Flying','Ground','Fairy','Plant','Humanshape','Water3','Mineral','Indeterminate','Water2','Ditto','Dragon','No Eggs'];
typeshp = ['Fighting','Flying','Poison','Ground','Rock','Bug','Ghost','Steel','Fire','Water','Grass','Electric','Psychic','Ice','Dragon','Dark'];
hps = ['0,1,2,3,4','5,6,7,8','9,10,11,12','13,14,15,16','17,18,19,20','21,22,23,24,25','26,27,28,29','30,31,32,33','34,35,36,37','38,39,40,41','42,43,44,45,46','47,48,49,50','51,52,53,54','55,56,57,58','59,60,61,62','63']; //possible Hidden Power "types"


/* UI specific functions */
function get_text(id,n) { //Returns text associated with n value from id (<select/>)
	var a = $(id).value;
	$(id).value = n;
	var b = $(id).options[$(id).selectedIndex].text;
	$(id).value = a;
	return b;
}

pkmns=pkmns.split('|');
pkmns.sort(); //Sort names alphabetically
function pop_species() { //Populates the species list
	var a = document.createDocumentFragment();
	var i=0,j=pkmns.length; do {
		var b = pkmns[i].split(':');
		var c = el_add(a,"option",{value:b[1]},b[0]);
		if ((forms[b[1]] > 649 && forms[b[1]] < forms_after) || forms[b[1]] > 746) { c.className = 'new'; } //show new species
		i++;
	} while (i<j);
	$('species').appendChild(a);
}

online = 0; //global- online status
function online_check() { //Checks if there's an internet connection alive
	if (navigator.onLine) {
		if (online == 1) { return true; }
		online = 1;
		add_sprite();
		//Version Check - DO NOT change the following
		$('version').innerHTML = '<a href="http://www.legendarypokemon.net/ivcalcxy.html"><img id="verchk" alt=""/></a><span class="error">Ø</span> <strong>There is a <a href="http://www.legendarypokemon.net/ivcalcxy.html">newer version</a> available!</strong>';
		var verchk = $('verchk');
		verchk.src = 'http://www.legendarypokemon.net/ivcalcxy_1.2.png?p='+ Math.floor(Math.random( )*100);
		verchk.onload = function() { if (verchk.width==1) { $('version').innerHTML = '<span class="ok">OK!</span> You are using the latest version!'; } }
	}
	else { $('version').innerHTML =  '<span class="error">Ø</span> Browser is <strong>offline</strong>! Unable to check for updates.'; }
}

themes = ['isotope','spp','simplex']; //define your own themes here, feel free to edit this
themed = themes.indexOf('none'); //global- set default theme here
theme = (!cookie.get('theme')?themed:cookie.get('theme'));
function toggle_theme() {
	$('calculator').className = themes[theme];
	display_status('The active theme has been changed to "'+themes[theme]+'".<br/><span class="btn" onclick="toggle_simple();">Simplify?</span>');
	if (theme == -1 && (navigator.userAgent.indexOf('MSIE ') == -1)) {
		display_status('The active theme has been changed to "Colorize".<br/>Select Hue, Saturation and Brightness:');
		var c = cookie.get('color') || 'd';
		if (c.charAt(0) == ',') {
			c = c.split(',');
			thema(c[1],c[2],c[3]);
		}
		$('status').innerHTML += '<br/><br/><input id="hue" type="range" min="0" max="360" value="150" />';
		$('status').innerHTML += '<br/><input id="sat" type="range" min="0" max="100" value="4" />';
		$('status').innerHTML += '<br/><input id="lit" type="range" min="0" max="100" value="74" />';
		events.add($('hue'),"change", function () {  thema($('hue').value,$('sat').value,$('lit').value); });
		events.add($('sat'),"change", function () {  thema($('hue').value,$('sat').value,$('lit').value); });
		events.add($('lit'),"change", function () {  thema($('hue').value,$('sat').value,$('lit').value); });
		events.add($('hue'),"keyup", function (evt) {  vv(this.id,0,360,evt); thema($('hue').value,$('sat').value,$('lit').value); });
		events.add($('sat'),"keyup", function (evt) {  vv(this.id,0,100,evt); thema($('hue').value,$('sat').value,$('lit').value); });
		events.add($('lit'),"keyup", function (evt) {  vv(this.id,0,100,evt); thema($('hue').value,$('sat').value,$('lit').value); });
	}
	cookie.set('theme',theme,60);
	theme = (theme == themes.length?-1:theme*1+1);
}
function toggle_simple() {
	$('calculator').className += ' simplex';
	dom.toggle($('info')); dom.toggle($('instructions'));
	display_status('All is plain and neat now!<br/>(refresh page to restore defaults)');
}
function thema(h,s,l) { //Color theming, does not work in IE8
	var bg = 'hsl('+h+', '+s+'%, '+l+'%)';
	var bd = 'hsl('+h+', '+s+'%, '+(l-20)+'%)';
	var bd2 = 'hsl('+h+', '+s+'%, '+(l-26)+'%)';
	var bp = 'hsl('+h+', '+s+'%, '+(l-9)+'%)';
	var bs = 'hsl('+h+', '+s+'%, '+(l-16)+'%)';
	$('thema').innerHTML = '#calculator{background:'+bg+';border-color:'+bd+';}#calculator .primary{background:'+bp+';}#calculator .secondary{background:'+bs+';}#calculator input,#calculator select,#calculator .button{border-color:'+bd2+';color:'+bd2+';}#calculator .button {background-color:'+bg+';}'; //dibs on this method
	cookie.set('color',','+h+','+s+','+l,60);
}
eps = 1; //global- EPs enabled
function toggle_evs() { //Enable/Disable EV functions
	switch(eps) {
		case 1:
			eps = 0; $('btn-evs').value = 'EVs: OFF';
		break;
		case 0:
			eps = 1; $('btn-evs').value = 'EVs: ON';
		break;
	}
	var j = $c('eps').slice();
	var i = j.length-1; do {
		toggle(j[i]);
	} while(i--);
	display_base();
}
mode = 0; //global- Single enabled
function toggle_mode(m) { //Single/Team/Row mode
	var m = m || mode;
	switch(m) {
		case 0:
			mode = 1;
			$('btn-mode').value = 'Team Calculation';
			$('mode0').style.display='none';
			$('mode1').style.display='';
			$('btn-hp').disabled = 'disabled';
			$('btn-stats').disabled = 'disabled';
			$('btn-eps').disabled = 'disabled';
			display_status('Mode has been changed to <strong>Team Calculation</strong>.');
			break;
		case 1:
			mode = 2;
			$('btn-mode').value = 'Row Calculation';
			$('mode0').style.display='';
			$('mode1').style.display='none';
			$('btn-hp').disabled = '';
			$('btn-stats').disabled = '';
			display_status('Mode has been changed to <strong>Row Calculation</strong>.');
			break;
		default:
			mode = 0;
			$('btn-mode').value = 'Single Pokémon';
			$('mode0').style.display='';
			$('mode1').style.display='none';
			$('btn-hp').disabled = '';
			$('btn-stats').disabled = '';
			$('btn-eps').disabled = '';
			display_status('Mode has been changed to <strong>Single Pokémon</strong>.');
	}
	display_sprite();
	display_effectiveness($('number-'+(act>-1?act:0)).value);
}
/* Save & Load functionality */

function code_load(c) { //Loads a SaveCode
	//var c = prompt('Input SaveCode or [Cancel] to load from URL:') || location.search;
	//var c = location.search;
	display_status('<span class="loading">Loading SaveCode...</span>');
	if (c == undefined || c.indexOf('?sc=') == -1) { display_status('Cannot load improper SaveCode.'); return NULL; }
	c = c.replace(/%20/gi,'').substring(1).split('!');
	if (c.length < 2) { display_status('Cannot load improper SaveCode.'); return; }
	var  i = c.length-1; do { c[i] = c[i].split(','); } while(i--);
	//Check if SaveCodeVersion is compatible (may change with Black/White)
	if (c[0][0] > 1) { display_status('Cannot load incompatible SaveCode.'); return; }
	//Check if SaveCodeUI is compatible, and restore UI
	if (c[0][1] == 0) {
		if (c[0][2] == 0 && eps == 1) { toggle_evs(); }
		var i = c[0][3]*1;
		if(mode!=i) { if(mode==2) { mode = 0; } toggle_mode(i-1); }
		display_status('<span class="loading">Loading SaveCode...</span>');
		mode = i;
		$('nickname').value = unescape(c[0][4]);
	}
	//Load user entered IVs
	$('statlvl').value = c[1][6]; $('hiddent').innerHTML=''; $('hiddenp').innerHTML='';
	var  i=5; do {
		ivs[i] = ivr.slice();
		$('med'+i+'-0').value = c[1][i]*1;
		$('spr'+i+'-0').innerHTML = '';
		$('plv'+i+'-0').innerHTML = '';
		$('stats'+i).innerHTML = '';
	} while(i--);
	//Load row data
	$('statrows').style.display = 'none';
	el_del($('statrows'));act=-1;actp=0;rn=1;rs=[0];ivs=[];

	var i=2, r=i-2; l=c.length;
	if (l > 2) {
		do {
			if (r!=0) { row_add(0,c[i][1]); };
			$('level-'+r).value = c[i][1]*1; $('number-'+r).value = c[i][0]*1; $('nat-'+r).value = c[i][14]*1; $('char-'+r).value = c[i][15]; $('hpt-'+r).value = c[i][16]*1;
			$('pot0-'+r).value = c[i][17]*1; $('pot1-'+r).value = c[i][18]; $('pot2-'+r).value = c[i][19]*1;
			var  j=5; do {
				$('stat'+j+'-'+r).value = c[i][j+2]*1;
				$('ep'+j+'-'+r).value = c[i][j+8]*1;
			} while(j--);
			display_eps();
			i++; r++;
		} while (i<l);
	}
	//Restore focus and set active row
	$('act-0').checked = 1; act=0; actp=0; row_sync();
	$('statrows').style.display = '';

	display_effectiveness($('number-'+act).value);
	tooltips();
	display_status('Loaded SaveCode successfully!');
	$('btn-ivs').focus();
}
function code_save() { //Displays a SaveCode
	var c = '?sc=0,0,'; //Data/SaveCode version
	c += eps+',';
	c += mode+',';
	c += escape($('nickname').value)+'!';
	c += $('med0-0').value+',';
	c += $('med1-0').value+',';
	c += $('med2-0').value+',';
	c += $('med3-0').value+',';
	c += $('med4-0').value+',';
	c += $('med5-0').value+',';
	c += $('statlvl').value+'';
	var s = $c('statrow'), i = (mode==2?0:s.length), r = (mode==2 && act>-1?act:0); s.reverse();
	do {
		c += '!'+$('number-'+r).value+','+$('level-'+r).value+','+$('stat0-'+r).value+','+$('stat1-'+r).value+','+$('stat2-'+r).value+','+$('stat3-'+r).value+','+$('stat4-'+r).value+','+$('stat5-'+r).value+','+$('ep0-'+r).value+','+$('ep1-'+r).value+','+$('ep2-'+r).value+','+$('ep3-'+r).value+','+$('ep4-'+r).value+','+$('ep5-'+r).value+','+$('nat-'+r).value+','+$('char-'+r).value+','+$('hpt-'+r).value+','+$('pot0-'+r).value+','+$('pot1-'+r).value+','+$('pot2-'+r).value;
		if (i > 0) { r = s[i-1].id.split('-')[1]; }
	} while (i--);
	display_status('<a href="'+c+'">SaveCode</a> (<a href="http://j.mp/http://www.legendarypokemon.net/ivcalcxy.html'+c+'">shorten</a>):<br/>'+c.split('!').join('! '));
	$('contact').href = 'http://www.legendarypokemon.net/contact?topic=IV%20Calculator&text='+escape('My browser is: '+navigator.userAgent+'\nMy savecode is: '+c+'\n\n');
	//window.location += c; //Uncomment for old behaviour
}

/* Row functions */

act = 0; actp = 0; //global- active row; previous active row
rn = 1; rs = [0]; //global- new row counter; array of current rows
error = 1; //global- error flag, default: true
function row_act(n) { //Makes n row active
	if ($('act-'+n).value == act) {
		actp = act;
		act = -1;
		$('act-'+n).checked = 0;
		$('name').focus();
		$('ept').style.visibility = '';
		if (online == 1) { display_sprite(); }
		display_effectiveness($('number').value);
		return false;
	}
	act = n;
	actp = 0;
	$('act-'+n).checked = 1;
	/*$('number-'+n).readonly = 'readonly'; $('number-'+n).disabled = ''; //look into this
	$('number-'+actp).readonly = ''; $('number-'+actp).disabled = 'disabled';*/
	$('ept').style.visibility = 'hidden';
	row_sync();
}
function row_sync() { //Syncs the display with active row
	var n=act, t=$('pot1-'+n).value.split('.');
	$('number').value = Math.floor($('number-'+n).value);
	$('species').value = $('number-'+n).value;
	$('nat').value = $('nat-'+n).value;
	$('char').value = $('char-'+n).value;
	$('hpt').value = $('hpt-'+n).value;
	$('pot0').value = $('pot0-'+n).value;
	$('pot2').value = $('pot2-'+n).value;
	var i=5; do {
		$('pot1').options[(i+1)].selected = (t.indexOf(i.toString()) > -1?true:false);
	} while(i--);
	display_effectiveness($('number-'+n).value);
	display_base();
	display_nature();
	display_char();
	if (mode == 2) { calc_ivs(n); }
	if (online == 1) { display_sprite(); }
}
function row_edit() { //Makes active row editable
	var n=act, t=[];
	if (n == -1) { return false; }
	$('number-'+n).value = $('species').value;
	$('nat-'+n).value = $('nat').value;
	$('char-'+n).value = $('char').value;
	$('hpt-'+n).value = $('hpt').value;
	$('pot0-'+n).value = $('pot0').value;
	var i=6; do {
		if ($('pot1').options[i].selected && t.indexOf(i-1) == -1 ) { t.push(i-1); }
	} while(i--);
	$('pot1-'+n).value = t.join('.');
	$('pot2-'+n).value = $('pot2').value;
}
function row_up(r) { //Moves row upwards
	var t=[], n=[], p=rs[rs.indexOf(r)-1];
	if ($('act-'+p).checked == 0) { row_act(p); }
	else if (online == 1) { display_sprite(); }
	p = $('level-'+p,'stat0-'+p,'stat1-'+p,'stat2-'+p,'stat3-'+p,'stat4-'+p,'stat5-'+p,'number-'+p,'nat-'+p,'char-'+p,'hpt-'+p,'pot0-'+p,'pot1-'+p,'pot2-'+p,'ep0-'+p,'ep1-'+p,'ep2-'+p,'ep3-'+p,'ep4-'+p,'ep5-'+p);
	n = $('level-'+r,'stat0-'+r,'stat1-'+r,'stat2-'+r,'stat3-'+r,'stat4-'+r,'stat5-'+r,'number-'+r,'nat-'+r,'char-'+r,'hpt-'+r,'pot0-'+r,'pot1-'+r,'pot2-'+r,'ep0-'+r,'ep1-'+r,'ep2-'+r,'ep3-'+r,'ep4-'+r,'ep5-'+r);
	p.map(function(v){t.push(v.value); });
	n.map(function(v,i){p[i].value=v.value;v.value=t[i];});
	display_eps(r);
	row_sync();
}
function row_del(n) { //Removes n row
	rs.splice(rs.indexOf(n),1);
	if (act==n) { row_act(0); }
	$('statrows').removeChild($('statrow-'+n));
	$('statrows').removeChild($('eprow-'+n));
	row_sync();
}
function row_add(n,lvl) { //Appends a new row
	if (n > 0) { rn = (rs.length == 1?1:n); }
	if (!lvl && mode==0) {
		var lvl = $('level-'+rs[(rs.length-1)]).value;
		lvl = (lvl<100?lvl*1+1:100);
	}
	lvl = lvl || 100;
	var ep = [0,0,0,0,0,0];
	if (mode==0) {
		var p = rs[(rs.length-1)];
		var ep = [$('ep0-'+p).value,$('ep1-'+p).value,$('ep2-'+p).value,$('ep3-'+p).value,$('ep4-'+p).value,$('ep5-'+p).value,];
	}
	rs.push(rn);
	var a = document.createDocumentFragment();
	var b = el_add(a,"tr",{id:'statrow-'+rn,className:'statrow'});
		el_add(b,"td",'','<input type="radio" class="radio tooltip" name="act" id="act-'+rn+'" value="'+rn+'" onclick="row_act('+rn+');" title="(De)Activate this row."/> <span class="btn tooltip" onclick="row_del('+rn+');" title="Delete this row.">-</span>');
		el_add(b,"td",'','<input type="text"  id="level-'+rn+'" name="level-'+rn+'" maxlength="3" size="3" value="'+lvl+'" onkeyup="vv(this.id,0,100,event,'+rn+');" />');
		el_add(b,"td",{},'<span class="btn tooltip" onclick="row_up('+rn+');" title="Move row upwards.">^</span>');
		var i = 0; do {
			el_add(b,"td",'','<input type="text" name="stat'+i+'-'+rn+'" id="stat'+i+'-'+rn+'" maxlength="3" size="3" value="" onkeyup="vv(this.id,0,999,event,'+rn+');" />');
			i++;
		} while (i<6);
		el_add(b,"td",'','<input type="text" disabled="disabled" id="number-'+rn+'" name="number-'+rn+'" maxlength="3" size="3" value="'+$('number').value+'" /><input type="hidden" id="nat-'+rn+'" name="nat-'+rn+'" value="'+$('nat').value+'" /><input type="hidden" id="char-'+rn+'" name="char-'+rn+'" value="'+$('char').value+'" /><input type="hidden" id="hpt-'+rn+'" name="hpt-'+rn+'" value="'+$('hpt').value+'" /><input type="hidden" id="pot0-'+rn+'" name="pot0-'+rn+'" value="'+$('pot0').value+'" /><input type="hidden" id="pot1-'+rn+'" name="pot1-'+rn+'" value="'+$('pot1').value+'" /><input type="hidden" id="pot2-'+rn+'" name="pot2-'+rn+'" value="'+$('pot2').value+'" />');
	var c = el_add(a,"tr",{id:'eprow-'+rn,className:'eps'});
		if (eps == 0) { c.style.display = 'none'; }
		el_add(c,"td");
		el_add(c,"td",{id:'eps-'+rn,value:ep.sum()});
		el_add(c,"td");
		var i = 0; do {
			el_add(c,"td",'','<input type="text" name="ep'+i+'-'+rn+'" id="ep'+i+'-'+rn+'" maxlength="3" size="3" value="'+ep[i]+'" onkeyup="vv(this.id,0,255,event,'+rn+');display_eps();" />');
			i++;
		} while (i<6);
		el_add(c,"td");
	$('statrows').appendChild(a);
	row_act(rn);
	rn++;
}
function add_eps() { //adds provided effort points to Pokemon's Effort Values
	function validate_eps(ep1,ep2) { //EPs limits | ep1 = current EPs | ep2 = EPs to be added
		var n = actp;
		var eps = 1*$('eps-'+n).innerHTML;
		epsum = 1*ep1 + 1*ep2;
		epsum2 = 1*ep1 + (510-1*eps);
		if (ep2 < 0 && epsum > 0) { return epsum; }
		if (eps < 510 && ep1 < 255) {
			ep3 = (eps + 1*ep2 < 510)?((epsum < 255)?epsum:255):((epsum2 < 255)?epsum2:255);
			return ((ep3 < 0)?0:ep3);
		}
		else { return ep1; }
	}
	display_base();
	var n = actp; //active row
	var  i=5; do {
		$('ep'+i+'-'+n).value = validate_eps($('ep'+i+'-'+n).value,$('eff'+i+'').innerHTML);
	} while(i--);
	display_eps();
	$('name').focus(); //return focus to input
}

/* Calculation functions */
function calc_effectiveness(typ,type1,type2) { //Calculates effectiveness
	var mul = damage[typ][type1];
	if (type2 != type1) { mul = mul * damage[typ][type2]; }
	return mul;
}
function calc_hiddenp() { //Calculates Hidden Power's power
	return 60;  //Obsolete since XY
	var a = arguments;
	return Math.floor((0.5*(a[0]&2)+1*(a[1]&2)+2*(a[2]&2)+4*(a[5]&2)+8*(a[3]&2)+16*(a[4]&2))*40/63 + 30);
	//return (((((a[4]&2)<<1) + (a[3]&2) + ((a[5]&2)>>>1))*10 + (a[2]&2)*3 + (a[0]&2) + (a[1]&2)) >>> 1)+30; //alternate, by Chase
}
function calc_hiddent() { //Calculates Hidden Power's type
	var a = arguments;
	return Math.floor(((a[0]&1)+2*(a[1]&1)+4*(a[2]&1)+8*(a[5]&1)+16*(a[3]&1)+32*(a[4]&1))*15/63);
	//return (a[2] & 1) + ((a[5] & 1) << 1) + ((a[3] & 1) << 2) + ((a[4] & 1) << 3); //alternate, by Chase, uses the main types[]
}
function calc_hidden(n) { //Displays all possible Hidden Powers
	//d = new Date(); time = d.getTime(); //DEBUG
	function display_hp() {
		t.reverse().sort(); p.sortnum();
		$('hiddent').innerHTML = t.join(', ');
		$('hiddenp').innerHTML = 60; //p.join(', ');
		//array_intersect(ivs[i],eo[ivhss[i][0]].slice());
		//d = new Date(); display_status((d.getTime()-time)/1000); return true; //DEBUG
		display_text(n);
	}
	display_status('<span class="loading">Calculating <em>Hidden Power</em>...</span>');

	if ($('medl').checked) {
		var t = [typeshp[calc_hiddent($('med0-0').value,$('med1-0').value,$('med2-0').value,$('med3-0').value,$('med4-0').value,$('med5-0').value)]];
		//var p = [calc_hiddenp($('med0-0').value,$('med1-0').value,$('med2-0').value,$('med3-0').value,$('med4-0').value,$('med5-0').value)];
		display_hp(); return true;
	}

	if (error != 0) { display_status('Does not compute!<br/>Properly input or Calculate IVs first.'); return false; }
	var a = [], b = $('hpt-'+n).value, t = [], p = [], i0=ivs[0].length-1;
	do { //must optimize this further
		a[0] = ivs[0][i0];
		var i1=ivs[1].length-1;
		do {
			a[1] = ivs[1][i1];
			var i2=ivs[2].length-1;
				do {
					a[2] = ivs[2][i2];
					var i3=ivs[3].length-1;
						do {
							a[3] = ivs[3][i3];
							var i4=ivs[4].length-1;
								do {
									a[4] = ivs[4][i4];
									var i5=ivs[5].length-1;
										do {
											a[5] = ivs[5][i5];
											var c = typeshp[calc_hiddent(a[0],a[1],a[2],a[3],a[4],a[5])];
											if (b == -1 || c == typeshp[b]) {
												if (t.indexOf(c) == -1) { t.push(c); }
												//var d = calc_hiddenp(a[0],a[1],a[2],a[3],a[4],a[5]);
												//if (p.indexOf(d) == -1) { p.push(d); }
											}
											if (p.length == 41 && t.length == 16) { display_hp(); return true; } //exit loops if all possible
										} while (i5--);
								} while (i4--);
						} while (i3--);
				} while (i2--);
		} while (i1--);
	} while (i0--);
	display_hp();
}
function calc_stat(species,pstat,stativ,statev,pokelvl,nature) { //Calculates Pokemon stats
	var basestat = get_base(species,pstat);
	var bonus = natures[nature][(pstat-1)];
	if (eps == 0) { var statev = 0; }
	if (pstat == 0) { //HP uses a different formula
		var result =  (Math.floor(((basestat*2 + (stativ/1) + Math.floor(statev/4))*pokelvl)/100)) + (pokelvl/1) + 10;
		if (species == 292) { return 1; } //Shedinja Case
	}
	else { var result = Math.floor((Math.floor(((basestat*2 + (stativ/1) + Math.floor(statev/4))*pokelvl)/100) + 5)*bonus); }
	return result;
}

ivs = [ivr.slice(),ivr.slice(),ivr.slice(),ivr.slice(),ivr.slice(),ivr.slice()]; //global- IVs array
function calc_stativ(species,pstat,stat,statev,pokelvl,nature,chara,pot1,pot2) { //Calculates Pokemon IVs - brute force
	var chara = chara.split('.');
	var pot1 = pot1.split('.');
	var charas = [[0,5,10,15,20,25,30],[1,6,11,16,21,26,31],[2,7,12,17,22,27],[3,8,13,18,23,28],[4,9,14,19,24,29]];
	var pots = [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],[16,17,18,19,20,21,22,23,24,25],[26,27,28,29,30],[31]];
	ivs[pstat] = [-1];
	var  i=31; do {
		if (calc_stat(species,pstat,i,statev,pokelvl,nature) == stat) { ivs[pstat].unshift(i); }
	} while(i--);

	if (pstat == 0 && species == 292) { ivs[pstat] = ivr.slice(); } //Shedinja Case

	if (chara[0] == pstat && chara != -1) {
		ivs[pstat] = array_intersect(ivs[pstat],charas[chara[1]]);
		maxiv = ivs[pstat][ivs[pstat].length-1]; //global maximum IV
	}
	if (pot1.indexOf(pstat.toString()) != -1 && pot2 != -1) {
		ivs[pstat] = array_intersect(ivs[pstat],pots[pot2]);
	}
	if (ivs[pstat][0] > miniv[1]) { miniv[1] = ivs[pstat][0]; }
	return ivs[pstat];
}
function calc_ivs(rn) { //Calculates a complete IV set
	error = 0; //global- reset errors
	if ($('number-0').value == 0) {
		error = 'Halt and Disable Operator!<br/>Perhaps you should select a <em class="error">Pokémon Species</em>...';
		display_status(error);
		$('name').value=''; $('name').focus();
		return false;
	}
	if ($('level-0').value == 0) {
		error = 'Does not compute!<br/><em class="error">Level</em> cannot be zero.';
		display_status(error);
		$('level-0').focus();
		return false;
	}
	display_status('<span class="loading">Calculating <em>Individual Values</em>...</span>');

	function validate_iv(result,species,pstat,stat,statev,pokelvl,nature) { // IV error handling
		var spname = get_text('species',species);
		var max = calc_stat(species,pstat,31,statev,pokelvl,nature);
		var min = calc_stat(species,pstat,0,statev,pokelvl,nature);
		if (stat > max || stat < min) {
			error = '<em>'+spname+'</em> Lv.'+pokelvl+' does not compute!<br/><em class="error">'+stats[pstat]+'</em> ('+stat*1+') should be '+min+' to '+max+'.<br/> The <em class="error">Effort Points</em> or <em class="error">Nature</em> may be inaccurate.';
			ivs[pstat] = [-1];
			return ['error'];
		}

		var i=0,l=result.length; do {
			if (result[i] > maxiv) { //beyond characteristic upper bound
				result = result.slice(0,i);
			}
			if (miniv[0] == pstat && result[i] >= miniv[1]) { //best iv must remain be at least equal to the lower bound
				result = result.slice(i);
			}
			i++;
		} while(i<l);

		if (result.length == 0 || result[0] > maxiv || result[0] == -1 || result[result.length] > 31) { //out of any bounds
			error = '<em>'+spname+'</em> Lv.'+pokelvl+' does not compute!<br/>The <em class="error">'+stats[pstat]+'</em> stat, <em class="error">Effort Points</em>, <em class="error">Characteristic</em> or <em class="error">Best Stat</em> are inaccurate.'; //global error - prevent complex calculations
			ivs[pstat] = [-1];
			return ['error'];
		}
		return result;
	}
	function validate_ties() { //Refines in case max IVs tie
		var ties = $('pot1-'+rn).value.split('.');
		var l = ties.length;
		if (l > 1) {
			var t = ivs[ties[0]].slice();
			var i=1; do {
				t = array_intersect(t,ivs[ties[i]]);
				if (t[0] == undefined) {
					error = '<em>'+get_text('species',$('number-'+rn).value)+'</em> Lv.'+$('level-'+rn).value+' does not compute!<br/><em class="error">Best Stat/s</em> entered is/are inaccurate.';
					return false;
				}
				i++;
			} while(i<l);
			ties.map(function(v){ivs[v]=t.slice();});
		}
	}

	maxiv = 31; miniv = [-1,0];//global- maximum IV
	ivs = [ivr.slice(),ivr.slice(),ivr.slice(),ivr.slice(),ivr.slice(),ivr.slice()];
	//Calculate row(s)
	var rn = rn || 0;
	var i=rn, l=(mode!=0?(rn+1):rs.length); do {
		//alert(rn); //DEBUG
		var r=rs[i];
		var j=5; do {
			ivs[j] = array_intersect(ivs[j],calc_stativ($('number-'+r).value,j,$('stat'+j+'-'+r).value,$('ep'+j+'-'+r).value,$('level-'+r).value,$('nat-'+r).value,$('char-'+r).value,$('pot1-'+r).value,$('pot2-'+r).value));
			if (error != 0) { display_status(error); $('stat'+j+'-'+r).focus(); return false; }
		} while(j--);
		miniv[0] = $('char-'+r).value.split('.')[0];
		i++;
	} while(i<l);
	//Validate IVs
	var c = 0; var i=5; do {
		ivs[i] = validate_iv(ivs[i],$('number-'+r).value,i,$('stat'+i+'-'+r).value,$('ep'+i+'-'+r).value,$('level-'+r).value,$('nat-'+r).value);
		if (error != 0) { display_status(error); $('stat'+i+'-'+r).focus(); return false; }
		if (ivs[i].length == 1) { c++; }
	} while(i--);

	validate_ties();
	if (error != 0) { display_status(error); $('pot1').focus(); return false; }

	//Refine using Hidden Power //XY TODO
	if ((error == 0) && $('hpt-'+rn).value > -1) {
		if (c == 6 && ($('hpt-'+rn).value != calc_hiddent(ivs[0][0],ivs[1][0],ivs[2][0],ivs[3][0],ivs[4][0],ivs[5][0]))) {
			error = '<em>'+get_text('species',$('number-'+rn).value)+'</em> Lv.'+$('level-'+rn).value+' does not compute!<br/><em class="error">Hidden Power</em> ('+typeshp[$('hpt-'+rn).value]+') entered is inaccurate.';
			display_status(error);
			$('hpt').focus();
			return false;
		}

		ivh = [];
		var k = 0;
		var  i=5; do {
			ivh[i] = [];
			for(var j=0;j<ivs[i].length;j++) { //global- make odd&even possibility array for every stat
				ivh[i].push(((ivs[i][j]%2==1)?1:0));
				if (ivh[i].length == 2) { k++; break; }
			}
		} while(i--);
		var hp = hps[$('hpt-'+rn).value].split(',');
		for (var i=0; i < hp.length;i++) {
			hp[i] = (hp[i]*1).toString(2); //decimal -> binary SpDef/SpAtk/Spd/Def/Atk/HP
			hp[i] = hp[i].split('');
			hp[i] = hp[i].reverse(); //-> HP/Atk/Def/Spd/SpAtk/SpDef
			hp[i].push(0,0,0,0,0); //ensure all bits are there
			hp[i] = hp[i].slice(0,6); //but we only need 6
			var s = hp[i][3]; //-> HP/Atk/Def/SpAtk/SpDef/Spd
			hp[i][3] = hp[i][4];
			hp[i][4] = hp[i][5];
			hp[i][5] = s;
		}
		var ivhs = [];
		var l = 0;
		for (var i=0;i < hp.length;i++) {
			if ((ivh[0].indexOf(1*hp[i][0]) != -1) && (ivh[1].indexOf(1*hp[i][1]) != -1) && (ivh[2].indexOf(1*hp[i][2]) != -1) && (ivh[3].indexOf(1*hp[i][3]) != -1) && (ivh[4].indexOf(1*hp[i][4]) != -1) && (ivh[5].indexOf(1*hp[i][5]) != -1)) { //if all match then add to possible hps[] value for given type
				ivhs[l] = [];
				ivhs[l] = hp[i].slice();
				l++;
			}
		}
		var ivhss = [];
		var l = 0;
		for (var i=0;i < ivhs.length;i++) {
			var j=5; do { //make possibility array for every stat, [0], [1] or [0,1]/[1,0] for given type
				if (!ivhss[j]) { ivhss[j] = []; }
				var t = ivhs[i][j];
				if (ivhss[j].length < 2 && ivhss[j].indexOf(t) == -1) { ivhss[j].push(t); }
				if (ivhss[j].length == 2) { l++; }
			} while(j--);
		}
		if (l != 6) { //ensure not all combinations are possible for given type
			var i=5; do {
				if (!ivhss[i]) {
					error = '<em>'+get_text('species',$('number-'+rn).value)+'</em> Lv.'+$('level-'+rn).value+' does not compute!<br/><em class="error">Hidden Power</em> ('+typeshp[$('hpt-'+rn).value]+') entered is inaccurate.';
					display_status(error);
					$('hpt').focus();
					return false;
				}
				if (ivhss[i].length == 1) {
					var eo = [];
					eo[0] = [0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30];
					eo[1] = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31];
					ivs[i] = array_intersect(ivs[i],eo[ivhss[i][0]].slice());
				}
			} while(i--);
		}
	}
	//end Hidden Power refine

	validate_ties();
	if (error != 0) { display_status(error); $('pot1').focus(); return false; }

	//Pinpoint next helpfull level and EPs if IVs are multiple
	//plv: 1-level 2-eps 3-stat1 4-stat2 - branched stats
	var lr = (mode==2?rn:rs[rs.length-1]);
	var plv = [];
	var  i=5; do {
		plv[i] = ['','','']; //level, branch, eps
		var z=1;
		if (ivs[i].length > 1 && mode!=1) {
			var j = $('level-'+lr).value;
			while (plv[i][0] == '' && j <= 100) {
				for (var z=1,zl=ivs[i].length;z <= zl;z++) {
					var statev = $('ep'+i+'-'+lr).value;
					var a = calc_stat($('number-'+lr).value,i,ivs[i][z-1],statev,j,$('nat-'+lr).value);
					var b = calc_stat($('number-'+lr).value,i,ivs[i][z],statev,j,$('nat-'+lr).value);
					if (ivs[i].length <= 2 && eps == 1) { //Calculate EPs for exact stat
						var y = statev;
						while (plv[i][2] == '' && y < 255) {
							for (var x=1,xl=ivs[i].length;x <= xl;x++) {
								var c = calc_stat($('number-'+lr).value,i,ivs[i][x-1],y,$('level-'+lr).value,$('nat-'+lr).value);
								var d = calc_stat($('number-'+lr).value,i,ivs[i][x],y,$('level-'+lr).value,$('nat-'+lr).value);
								if (c < d) { plv[i][2] = y; break; }
							}
							y++;
						}
					}
					if (a < b) { plv[i][0] = j; plv[i][3] = a; plv[i][4] = b; break; }
				}
				j++;
			}
			if ($('level-'+lr).value == 100) { plv[i][0] = ''; }
		}
		plv[i][1] = z-1;
	} while(i--);
	//Display Results
	var i=rs.indexOf(rn);
	if (i>-1) {
		display_ivs(rn,plv);
		if (mode==1 && rs[i+1]) { calc_ivs(rs[i+1],1); } //recursion if Team mode
	}
	//return true;
}
function calc_eps() { //Calculates and displays required EPs
	display_eps();
	$('statlvl').value = $('level-0').value;
	if (display_stats(0)) {
		$('stat0-0').focus();
		function count_eps(pstat,stat,iv,eps) { //calculates required EPs - brute force way
			for (var i=$(eps).value;i<=255;i++) {
				if (calc_stat($('number-0').value,pstat,$(iv).value,i,$('level-0').value,$('nat-0').value) == $(stat).value) { return i - $(eps).value; }
			}
			return 'Lv.';
		}
		var  i=5; do {
			$('eps'+i).innerHTML = count_eps(i,'stat'+i+'-0','med'+i+'-0','ep'+i+'-0');
		} while(i--);
		$('epsr').innerHTML = 1*$('eps0').innerHTML + 1*$('eps1').innerHTML + 1*$('eps2').innerHTML + 1*$('eps3').innerHTML + 1*$('eps4').innerHTML + 1*$('eps5').innerHTML + 1*$('eps-0').innerHTML;
		if(isNaN($('epsr').innerHTML)) { $('epsr').innerHTML = 'Lv.'; }
	}
	if ($('epsr').innerHTML > 510) { $('epsr').className = 'error';}
	if ($('epsr').innerHTML < 510) { $('epsr').className = '';}
}

/* Display functions */

function display_status(str,s) {
	var t = $('status').innerHTML;
	$('status').innerHTML = str;
	if (s>0) { setTimeout(function () { display_status(t); }, s*1000);	}
}
function display_base() { //Displays Base Stats
	var p = $('species').value;
	$('types').innerHTML =  (get_base(p,6) == get_base(p,7)?types[get_base(p,6)]:types[get_base(p,6)]+' / '+types[get_base(p,7)]);
	$('eggs').innerHTML =  (get_base(p,8) == get_base(p,9)?eggs[get_base(p,8)]:eggs[get_base(p,8)]+' / '+eggs[get_base(p,9)]);
	var  i=5; do {
		$('base'+i).innerHTML =  get_base(p,i);
	} while(i--);
	display_eps();
	display_effectiveness(p);
}
function display_eps(n) { //Displays provided EPs
	if (eps == 0) { return false; }
	var p = $('species').value;
	var n = (n>-1?n:(act>-1?act:actp)); //active row
	var sum = 1*$('ep0-'+n).value + 1*$('ep1-'+n).value + 1*$('ep2-'+n).value + 1*$('ep3-'+n).value + 1*$('ep4-'+n).value + 1*$('ep5-'+n).value;
	$('eps-'+n).innerHTML = (sum==510?'<span class="ok">'+sum+'</span>':sum);
	var item = $('item').value;
	var vit = ((item > 7)?0:1); //vitamins on or off
	var berry = 1; if (item > 13) { berry = -1; item = item-6; } //berries off or on
	var mult = $('times').value*(($('pkrs').checked == 1)?2:1)*((item == 1)?2:1)*vit; //multipliers

	//hp up, protein, iron, calcium, zinc, 13carbos - Pomeg, Kelpsy, Qualot, Hondew, Grepa and Tamato
	var  i=5; do {
		$('eff'+i).innerHTML =  mult*(1*(get_base(p,10)[i])+((item == 2+i)?4:0)) + $('times').value*(1*((item == i+8)?10:0))*berry;
		$('item').options[i+8].disabled = ''; //reset vitamins
		if ($('ep'+i+'-'+n).value*1+$('times').value*10 > 100 || 510 < sum+$('times').value*10 || $('level-'+n).value == 100) {
			$('item').options[i+8].disabled = 'disabled';
			if (item > 7) {
				$('eff'+i).innerHTML = ((item == i+8) && (berry == -1)?-10*$('times').value:0);
			}
		}
	} while(i--);

	if (sum > 510) { $('eps-'+n).className = 'error'; }
	else { $('eps-'+n).className = ''; }
}
function display_nature() {
	var n = $('nat').value;
	var i=5; do {
		$('nate-'+i).innerHTML = '-';
		if (natures[n][i-1] > 1) { $('nate-'+i).innerHTML = '<strong>&times;1.1</strong>'; }
		if (natures[n][i-1] < 1) { $('nate-'+i).innerHTML = '&times;0.9'; }
		i--;
	} while(i>0);
}
function display_char() {
	var i=5; do {
		$('med'+i+'-0').style.borderWidth = '';
	} while(i--);
	var n=$('char').value.split('.')[0];
	if (n > -1) { $('med'+n+'-0').style.borderWidth = '3'; }
}
function display_effectiveness(p) {
	var type1 = get_base(p,6);
	var type2 = get_base(p,7);
	var d = []; d[4] = []; d[0] = []; d[1] = []; d[2] = []; d[8] = []; d[16] = [];
	var t = []; t[4] = []; t[0] = []; t[1] = []; t[2] = []; t[8] = []; t[16] = [];

	if (mode==1 && act >-1) {
		for (var i=0,l=rs.length; i < l; i++)  {
			p = $('number-'+rs[i]).value;
			type1 = get_base(p,6);
			type2 = get_base(p,7);
			for (var j=0; j < 18; j++)  {
				var a = calc_effectiveness(j,type1,type2);
				if(!t[4*a][j]) {
					t[4*a][j] = 1;
					d[4*a].push(j);
				}
				else { t[4*a][j]++; }
			}
		}
	}
	else {
		for (var i=0; i < 18; i++)  {
			var a = calc_effectiveness(i,type1,type2);
			t[4*a][i] = 1;
			d[4*a].push(i);
		}
	}
	var i=4, j=[0,1,2,8,16]; do {
		d[j[i]] = d[j[i]].map(function(v){if(t[j[i]][v]>1){return types[v]+'<strong>&times;'+t[j[i]][v]+'</strong>';}return types[v];});
		d[j[i]].sort();
		$('dmg'+j[i]).innerHTML = d[j[i]].join(', ');
	} while(i--);
}
function add_sprite() { //Adds sprite events
	events.add($('species'), 'change', display_sprite);
	events.add($('name'), 'keyup', display_sprite);
	events.add($('number'), 'keyup', display_sprite);
	display_sprite();
}
spr = '';
function display_sprite() { //feel free to modify if you want to server sprites from your server
	clearTimeout(spr);
	if (!navigator.onLine) {
		online = 0;
		$('sprite').innerHTML = '';
		return false;
	}
	alt = {0:'egg',386.1:'386-a',386.2:'386-d',386.3:'386-s',413.1:'413-c',413.2:'413-t',492.1:'492-s',487.1:'487-o',479.1:'479-h',479.2:'479-w',479.3:'479-f',479.4:'479-s',479.5:'479-m',351.1:'351-s',351.2:'351-r',351.3:'351-i',550.1:'550-b',555.1:'555-d',648.1:'648-s',646.1:'646-w',646.2:'646-b',647.1:'647-r',641.1:'641-t',642.1:'642-t',645.1:'645-t',670.1:'678-e',678.1:'678-f',681.1:'681-b',710.1:'710-s',710.2:'710-l',710.3:'710-h',711.1:'711-s',711.2:'711-l',711.3:'711-h',3.1:'003-m',6.1:'006-mx',6.2:'006-my',9.1:'009-m',65.1:'065-m',94.1:'094-m',115.1:'115-m',127.1:'127-m',130.1:'130-m',142.1:'142-m',150.1:'150-mx',150.2:'150-my',181.1:'181-m',212.1:'212-m',214.1:'214-m',229.1:'229-m',248.1:'248-m',257.1:'257-m',282.1:'282-m',303.1:'303-m',306.1:'306-m',308.1:'308-m',310.1:'310-m',354.1:'354-m',359.1:'359-m',380.1:'380-m',381.1:'381-m',445.1:'445-m',448.1:'448-m',460.1:'460-m'};
	spr = setTimeout (function() {
		$('sprite').innerHTML = '';
		var i=0, l=(mode==1 && act >-1?rs.length:1), result='';
		do { //logic here needs reworking
			var n = (mode==1 && act >-1?$('number-'+rs[i]):$('species')).value*1;
			var m = n;
			if (alt[n]) {
				m = alt[n];
			}
			if (m < 10) {
				n = '0'+n;
				m = n;
			}
			if (m < 100) {
				n = '0'+n;
				m = n;
			}
			$('sprite').innerHTML += '<a href="http://www.serebii.net/pokedex-xy/'+(m > 0?Math.floor(n)+'.shtml':'')+'"><img src="http://www.serebii.net/'+
			(mode==1 && act >-1?'pokedex-xy/icon/'+m+'.png':'xy/pokemon/'+m+'.png')+'" alt="'+n+'" /></a>';
			i++;
		} while(i<l);
	}, 500);
}
function display_text(r) { //Displays copy & paste results
	var b=[],a = '#'+$('number-'+r).value+' '+get_text('species',$('number-'+r).value)+' ['+get_text('nat',$('nat-'+r).value)+']<br/>IVs: ';
	//get_text('gnd',$('gnd').value)
	var i=0; do {
		if (ivs[i].length > 3) {
			b.push(ivs[i][0]+' - '+ivs[i][(ivs[i].length-1)]);
		}
		else { b.push(ivs[i].join(', ')); }
		i++;
	} while (i<6);
	a += b.join(' / ');
	a += '<br/>Stats at Lv.'+$('level-'+r).value+': ';
	var i=0,b=[]; do {
		stat = $('stat'+i+'-'+r).value;
		ep = $('ep'+i+'-'+r).value;
		b.push(stat + (ep > 0?' ('+ep+')':''));
		i++;
	} while (i<6);
	a += b.join(' / ');
	display_status(a);
}
function display_stats(r,m) { //Displays calculated stats
	if ($('statlvl').value == 0) { $('statlvl').value = 100; }
	if (mode == 1) { display_status('Cannot compute Stats in Team mode.'); }

	var  i=5; do {
		if (m === '' && (!$('med'+i+'-0').value || error != 0)) {
			display_status('Does not compute!<br/>Properly input or Calculate IVs first.');
			return false;
		}
		switch(m) {
			case 0: var iv=0, ep=0, nat='min'; break;
			case 1: var iv=31, ep=255, nat='max'; break;
			default:
			var iv = $('med'+i+'-0').value, ep = $('ep'+i+'-'+r).value, nat = $('nat-'+r).value;
		}
		$('stats'+i).innerHTML = calc_stat($('number-'+r).value,i,iv,ep,$('statlvl').value,nat);
	} while(i--);
	return true;
}
function display_ivs(rn,plv) { //Displays IVs appropriately
	if (error != 0) { return false; }
	if (mode==1) {
		if (rn==0) {
			$('ivrows').style.display = 'none';
			el_del($('ivrows'));
			$('ivrows').style.display = '';
		}
		var a=[], i=0; do {
			if (ivs[i].length > 2) {
				a.push(ivs[i][0]+'-'+ivs[i][(ivs[i].length-1)])+'';
			}
			else { a.push(ivs[i].join('-')); }
			i++;
		} while (i<6);
		var r = el_add($('ivrows'),'tr');
		el_add(r,'td',{},'<h4 class="btn" onclick="toggle_mode(); if ($(\'act-'+rn+'\').checked == 0) { row_act('+rn+'); } calc_ivs('+rn+'); $(\'btn-mode\').focus();">#'+$('number-'+rn).value+':</h4>');
		var i=0; do {
			el_add(r,'td',{className:'right'},a[i]+'');
			i++;
		} while (i<6);
		display_status('Calculation complete.');
		return true;
	}
	var  i=5; do {
		if (!$('medl').checked) { $('med'+i+'-0').value = ivs[i][Math.ceil(ivs[i].length/2)-1]; }
		$('plv'+i+'-0').innerHTML = (plv[i][0] == ''?(ivs[i].length == 1?'<span class="ok">OK!</span>':'<span class="tooltip" title="Refine using Hidden Power.">[?]</span>'):'<span class="btn" onclick="row_add(0,'+plv[i][0]+'); $(\'stat0-\'+(rn-1)).focus();">'+plv[i][0]+'</span>')+(plv[i][2] == ''?'':'<br/><span class="eps">'+plv[i][2]+'</span>');

		var ivst = ivs[i].slice();
		if (plv[i][1]<ivst.length) { ivst[plv[i][1]] = ivst[plv[i][1]]+'</span><span class="tooltip" style="font-size: 0.9em;" title="Lv.'+plv[i][0]+' '+stats[i]+': &lt;strong&gt;'+plv[i][4]+'&lt;/strong&gt;">'; }
		$('spr'+i+'-0').innerHTML = '<span class="tooltip" style="font-weight: bold;" '+(plv[i][0] == ''?'':'title="Lv.'+plv[i][0]+' '+stats[i]+': &lt;strong&gt;'+plv[i][3]+'&lt;/strong&gt;"')+'>'+ivst.join(', ')+'&nbsp;</span>';
	} while(i--);
	rn = (mode==2?rn:rs[rs.length-1]);
	display_stats(rn); display_text(rn);
}

eval(function(a,r,c,e,u,s){u=function(c){return(c<r?'':u(parseInt(c/r)))+((c=c%r)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)s[u(c)]=e[c]||u(c);e=[function(u){return s[u]}];u=function(){return'\\w+'};c=1};while(c--)if(e[c])a=a.replace(new RegExp('\\b'+u(c)+'\\b','g'),e[c]);return a}('l s(){w($(\'z\')==q){y("\\u\\3\\A\\1\\2\\7\\0\\1\\4\\5\\1\\o\\4\\3\\9\\2\\6\\4\\3\\5\\1\\3\\m\\1\\6\\d\\4\\8\\1\\c\\7\\3\\f\\7\\2\\j\\r\\8\\1\\9\\4\\a\\0\\5\\a\\0\\h\\n\\p\\9\\0\\2\\8\\0\\1\\2\\9\\b\\2\\e\\8\\1\\i\\0\\0\\c\\1\\6\\d\\0\\1\\a\\7\\0\\g\\4\\6\\8\\1\\4\\5\\6\\2\\a\\6\\h\\n\\n\\b\\b\\b\\k\\9\\0\\f\\0\\5\\g\\2\\7\\e\\c\\3\\i\\0\\j\\3\\5\\k\\5\\0\\6");t}v();x()};',37,37,'u0065|u0020|u0061|u006f|u0069|u006e|u0074|u0072|u0073|u006c|u0063|u0077|u0070|u0068|u0079|u0067|u0064|u0021|u006b|u006d|u002e|function|u0066||u0076|u0050|null|u0027|init0|return|u0059|online_check|if|initO|alert|lp|u0075'.split('|'),0,{}));

function initO() { //Actions to perform once the page has loaded
	$('form').reset(); //reset all fields
	toggle_theme();
	tooltips();
	display_status('<span class="loading">Initializing...</span>');
	$('calculator').style.minHeight = (1*(window.innerHeight?window.innerHeight:(document.body?document.body.clientHeight:''))-16)+'px'; /* remove this when including */
	$('ept').style.visibility = 'hidden';
	$('mode1').style.display = 'none';
	dom.toggle($('history'));

	events.add($('name'),"keyup", function () { dom.autocomplete(this,$('species'),true); $('number').value=Math.floor($('species').value); display_base(); row_edit(); });
	events.add($('name'),"focus", function () { this.value = '' });
	events.add($('species'),"change", function () { $('name').value=$('species').options[$('species').selectedIndex].text; $('number').value=Math.floor($('species').value); display_base(); row_edit(); });
	events.add($('number'),"keyup", function (evt) { vv('number',0,forms_after,evt); $('species').value=$('number').value; $('name').value=$('species').options[$('species').selectedIndex].text; display_base(); row_edit(); });
	events.add($('nat'),"change", function () { display_nature(); row_edit(); });
	events.add($('charn'),"keyup", function () { dom.autocomplete(this,$('char'),true); display_char(); row_edit(); });
	events.add($('char'),"change", function () { $('charn').value=$('char').options[$('char').selectedIndex].text; display_char(); row_edit(); });
	events.add($('hpt'),"change", function () { row_edit(); if(act>-1){ $('level-'+act).focus(); }});
	events.add($('hpt'),"blur", function () { if(act>-1){ $('level-'+act).focus();}}); //fails in chrome, issue 6759
	events.add($('pkrs'),"click", function () { display_eps(); });
	events.add($('item'),"change", function () { display_eps(); });
	events.add($('times'),"keyup", function (evt) { vv('times',0,255,evt); display_eps(); });

	events.add($('level-0'),"keyup", function (evt) { vv('level-0',0,100,evt,0); });
	events.add($('statlvl'),"keyup", function (evt) { vv('statlvl',0,100,evt); });
	events.add($('act-0'),"click", function () { row_act(0); });
	var  i=5; do {
		events.add($('stat'+i+'-0'),"keyup", function (evt) { vv(this.id,0,999,evt,0); });
		events.add($('ep'+i+'-0'),"keyup", function (evt) { vv(this.id,0,255,evt,0); display_eps(); });
		events.add($('med'+i+'-0'),"keyup", function (evt) { vv(this.id,0,31,evt); });
	} while(i--);

	events.add($('pot0'),"change", function () { row_edit(); });
	if (navigator.userAgent.indexOf('AppleWebKit') > -1) { $('pot1').style.height = '18px'; } //workaround for Webkit, Chrome issue 41759
	events.add($('pot1'),"focus", function () { this.size=7; this.style.position='absolute'; this.style.width='88px'; this.style.height='auto'; });
	events.add($('pot1'),"blur", function () { this.size=7; this.style.position='absolute'; this.style.width='88px'; this.style.height='18px'; });
	events.add($('pot1'),"blur", function () { row_edit(); this.size=1; this.style.position=''; this.style.width='78px'; });
	events.add($('pot2'),"change", function () { row_edit(); });

	events.add($('btn-addrow'),"click", function () { row_add(); $((mode?'name':'stat0-'+(rn-1))).focus(); tooltips(); });
	events.add($('btn-addeps'),"click", add_eps);
	events.add($('btn-theme'),"click", toggle_theme);
	events.add($('btn-eps'),"click", function () { calc_eps(); });
	events.add($('btn-evs'),"click", toggle_evs);
	events.add($('btn-mode'),"click", function () { toggle_mode(mode); });
	events.add($('btn-save'),"click", code_save);
	events.add($('btn-ivs'),"click", function () { calc_ivs((mode==2 && act>-1?act:0)); tooltips(); });
	events.add($('btn-stats'),"click", function () { display_stats((act>-1?act:0)); });
	events.add($('btn-statsmin'),"click", function () { display_stats((act>-1?act:0),0); });
	events.add($('btn-statsmax'),"click", function () { display_stats((act>-1?act:0),1); });
	events.add($('btn-hp'),"click", function () { calc_hidden((mode==2 && act>-1?act:0)); });
	events.add($('toggleinfo'),"click", function () { dom.toggle($('info')); dom.toggle($('instructions')); });
	events.add($('toggleinstructions'),"click", function () { dom.toggle($('info')); dom.toggle($('instructions')); });
	events.add($('togglehistory'),"click", function () { dom.toggle($('history')); });

	var tload;
	events.add($('btn-load'),"click", function(){
		if(tload){
			clearTimeout(tload);
			tload = '';
			code_load(prompt('Input SaveCode:'));
		}
		else tload= setTimeout(function(){
			tload = '';
			code_load(location.search);
		},300);
	});

	pop_species();
	display_base();

	if (location.protocol != 'data:') {
		var br = navigator.userAgent;
		if (br.indexOf('iPhone') > -1 || br.indexOf('iPod') > -1 || br.indexOf('iPad') > -1) {
		$('download').innerHTML = "Hello dear &#63743; fan! You can <strong>save</strong> (really) this page, for offline use, by <a href=\"javascript:x=new XMLHttpRequest();x.onreadystatechange=function(){if(x.readyState==4)location='data:text/html;charset=utf-8;base64,'+btoa(unescape(encodeURIComponent(x.responseText)))};x.open('GET',location);x.send('');\">clicking here</a> and bookmarking after the redirect!";  }
	}

	$('name').focus();
	if (location.search.indexOf('sc=') > -1) { $('btn-load').value+='*'; $('btn-load').focus(); } //Make SavedCose visible

	if ((document.charset && document.charset.toLowerCase() != 'utf-8') || (document.characterSet && document.characterSet.toLowerCase() != 'utf-8')) {
		display_status("Please set your browser's encoding to UTF-8 or this tool may not work as expected.");
	}
	else { display_status('Run Without Error.<br/><span class="btn" onclick="toggle_simple();">Simplify?</span>'); }
}
events.add(window,"load", init0);
