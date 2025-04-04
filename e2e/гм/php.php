<?php
// Доступные переменные:  uv 230220
//
// $calculator - массив с данными калькулятора
// $fields - массив с данными полей калькулятора
// $form - массив с данными, заполненными пользователем

// Структура типов полей:
//
// text:
//   string
//
// number:
//   float
//
// radio:
//   array {
//     ["id"] => int
//     ["field"] => int
//     ["title"] => string
//     ["value"] => string
//   }
//
// checkbox:
//   array {
//     [0] => array {
//       ["id"] => int
//       ["field"] => int
//       ["title"] => string
//       ["value"] => string
//     }
//     [1] => array {...}
//     ...
//   }
//
// msproducts:
//   array {
//     ["id"] => int
//     ["pagetitle"] => string
//     ["price"] => float
//     ["other_product_fields"] => string|int|float|array
//   }
// Материал
//$material_name = $form['material']['pagetitle']; // название
//$material_price = (float)$form['material']['price']; // цена за кв.м.
//$material_cost = ceil($material_price * $sqm); // стоимость

// Материал




// case {$value['value']}:  //   {$value['title']}        $mat_price_z = ''; $mat_price_pz = ''; $mat_ves = '';        break;
// case {$value['value']}:  //   {$value['title']}        $krai_price_z = ''; $krai_price_pz = '';         break;

/**
 * Обозначаем основные переменные
 */

//$luvers = 12;
$rate = 1; // коэффициент


$mat_value = $form['mat_uv']['value'];
$srok_uv = $form['srok_uv']['value'];
$krai_uv = $form['krai_uv']['value'];

$sqm = (float)($form['shir'] * $form['vys']) / 1000000; // кв.м. из мм
$shir = (float)($form['shir']); $shi = (float)$shir/1000;
$vys = (float)($form['vys']); $vy = (float)$vys/1000;
$shi2 = $shi*2; $vy2=$vy*2;
$luv = (float)($form['luv']['value']);

$count = (float)($form['count']); // кол-во
$klei = (float)($form['klei']); // прочие услуги
$perimetr = (float)($form['shir'] + $form['vys'])*2/1000;
$sqm_count = $sqm * $count;


$mat_uv = [];
if (!empty($form['mat_uv'])) {
    $mat = [
        'name' => $form['mat_uv']['title'],
    //    'cost22' => $form['mat_uv']['value'],
    //    'cost_mat' => $form['mat_uv']['value'] * $sqm ,
    //    'cost_mat_count' => $form['mat_uv']['value'] * $sqm * $count ,
        'sqm_all' =>  $sqm * $count ,
    ];
}







switch ($mat_value) {








case 'pvh3_uv':           $mat_price_z = 2000     ; $mat_price_pz = 1950  ; $mat_ves = 10320/6; $mat_shir = '1,8';  $is_pvh = 1;   $rez = 30;  break;   // Пластик ПВХ 3 мм
case 'pvh5_uv':           $mat_price_z = 2510     ; $mat_price_pz = 2460  ; $mat_ves = 17190/6; $mat_shir = '1,8';  $is_pvh = 1;   $rez = 50; break;   // Пластик ПВХ 5 мм
case 'pvh10_uv':          $mat_price_z = 4250     ; $mat_price_pz = 4200  ; $mat_ves = 34380/6; $mat_shir = '1,8';  $is_pvh = 1;   $rez = 100; break;    // Пластик ПВХ 10 мм
case 'akp3_uv':           $mat_price_z = 4100     ; $mat_price_pz = 4050  ; $mat_ves = '5000';  $mat_shir = '1,50'; $is_pvh = 1;   $rez = 100; break; // Алюмокомпозит 3 мм
case 'bb115_uv':          $mat_price_z = 662      ; $mat_price_pz = 612   ; $mat_ves = '300';   $mat_shir = '1,6';  $is_baner = 0; $rez = 30; break;   // Бумага БлюБек Blue Back 115 г/м2 Европа
case 'nat_holst_uv':      $mat_price_z = 1940     ; $mat_price_pz = 1890  ; $mat_ves = '300';   $mat_shir = '1,8';  $is_holst = 1; $rez = 20;  break;  // Натуральный холст
case 'sk_perf_uv':        $mat_price_z = 900      ; $mat_price_pz = 880   ; $mat_ves = '300';   $mat_shir = '1,52'; $is_baner = 0; $rez = 20; break;  // Самоклеящаяся перфорированная пленка
case 'ban510_uv':         $mat_price_z = 800      ; $mat_price_pz = 750   ; $mat_ves = '510';   $mat_shir = '1,7';  $is_baner = 1; $is_holst = 1; $rez = 20; break;   // Баннерная ткань 510 г/м2 Европа литая
case 'backlit_uv':        $mat_price_z = 800      ; $mat_price_pz = 750   ; $mat_ves = '300';   $mat_shir = '1,52'; $is_baner = 1; $rez = 20; break;   // Светопропускающий баннер бэклит
case 'setka_uv':          $mat_price_z = 800      ; $mat_price_pz = 750   ; $mat_ves = '300';   $mat_shir = '1,8';  $is_baner = 0; $rez = 20; $is_setka = 1; break;   // Сетка
case 'sk_kit_uv':         $mat_price_z = 800      ; $mat_price_pz = 750   ; $mat_ves = '300';   $mat_shir = '1,2';  $is_baner = 0; $rez = 20; break;   // Самоклеящаяся пленка Китай
case 'poliester_uv':      $mat_price_z = 725      ; $mat_price_pz = 675   ; $mat_ves = '300';   $mat_shir = '1,52'; $is_baner = 0; $rez = 20; break;  // Полиэстер
case 'sk_svetoprop_uv':   $mat_price_z = 800      ; $mat_price_pz = 750   ; $mat_ves = '300';   $mat_shir = '1,2';  $is_baner = 0; $rez = 20; break;   // Пленка транслюцентная самокл. (светопропускающая)
case 'fes24_uv_06':       $mat_price_z = 2000     ; $mat_price_pz = 1950  ; $mat_ves = '300';   $mat_shir = '1,2';  $is_baner = 0; $rez = 30; break;   // Плёнка светонакапливающая ФЭС-24,фотолюминесцентная  (кратно 0,6м).
case 'fes24_uv':          $mat_price_z = 2150     ; $mat_price_pz = 2100  ; $mat_ves = '300';   $mat_shir = '1,2';  $is_baner = 0; $rez = 30; break;  // Плёнка светонакапливающая ФЭС-24,фотолюминесцентная
case 'poliprop_uv':       $mat_price_z = 1100     ; $mat_price_pz = 1050   ; $mat_ves = '320';   $mat_shir = '0,92'; $is_baner = 0; $rez = 20; break;    // Полипропилен PP для роллап 320гр
case 'polikarb_uv':       $mat_price_z = 1850     ; $mat_price_pz = 1830  ; $mat_ves = '300';   $mat_shir = '1,8';  $is_baner = 0; $rez = 100;  break;    // Поликарбонат 6мм Премиум молочный
case 'backlit_fl_uv':     $mat_price_z = 1100     ; $mat_price_pz = 1080  ; $mat_ves = '320';   $mat_shir = '1,8';  $is_baner = 0; $rez = 20; break;    // Бэклит для фреймлайтов, лайтбоксов 320гр








case 'plex_mol_uv':       $mat_price_z = '3200'; $mat_price_pz = '3190'; $mat_ves = '300';   $mat_shir = '1,8';  $is_baner = 0; $rez = 100; break;  // Оргстекло молочное Plexiglas 3х2050х3050мм., опал 30%






} //mat_value

switch ($krai_uv) {
    case 'alum_baget_zol_uv': // Алюм багет профиль серебро
        if ($is_pvh) { $krai_price_z = 400; $krai_price_pz = 390; $krai_cost_z = $krai_price_z * $perimetr; $krai_cost_pz = $krai_price_pz * $perimetr;  $is_tuba = 0;} break;
    case 'alum_baget_ser_uv': // Алюм багет профиль серебро
        if ($is_pvh) { $krai_price_z = 400; $krai_price_pz = 390; $krai_cost_z = $krai_price_z * $perimetr; $krai_cost_pz = $krai_price_pz * $perimetr;  $is_tuba = 0;} break;
    case 'podramnik_uv': // Натяжка на подрамник
        if ( $is_holst) { $krai_price_z = 200; $krai_price_pz = 200; $podramnik = 400; $krai_cost_z = $krai_price_z * $perimetr; $krai_cost_pz = $krai_price_pz * $perimetr;  $is_tuba = 0; } break;
    case 'pez_uv': // Резка по изображению
        $krai_price_z = $rez; $krai_price_pz = $rez; $krai_cost_z = $krai_price_z * $perimetr; $krai_cost_pz = $krai_price_pz * $perimetr;   $is_tuba = 1;break;
    case 'obr2_uv': // Обрезка с полями 2±1 см (по умолчанию, бесплатно)
        $krai_price_z = 0; $krai_price_pz = 0; $krai_cost_z = $krai_price_z * $perimetr; $krai_cost_pz = $krai_price_pz * $perimetr;  $is_tuba = 1; break;
}; //krai

$luv_price_z = 15; $luv_price_pz = 15 ;
switch ($luv) {
    case 2: // Люверсы через 50 см
        $luv_cost_z = $luv_price_z * $perimetr * 2; $luv_cost_pz = $luv_price_pz * $perimetr * 2;      break;
    case 40: // Люверсы через 40 см
        $luv_cost_z = $luv_price_z * $perimetr * 2.5; $luv_cost_pz = $luv_price_pz * $perimetr * 2.5; break;
    case 3: // Люверсы через 30 см
        $luv_cost_z = $luv_price_z * $perimetr * 10/3; $luv_cost_pz = $luv_price_pz * $perimetr * 10/3; break;
    case 4: // Люверсы по 4 углам
        $luv_cost_z = $luv_price_z * 4; $luv_cost_pz = $luv_price_pz * 4; break;
    case 0: // Люверсы не нужны
        $luv_price_z = 0; $luv_price_pz = 0 ;
        $luv_cost_z = 0; $luv_cost_pz = 0;       break;
};

switch ($klei) {
    case 25: // Ветровые карманы
        $karm_price_z = '25'; $karm_price_pz = '25';
        $karm_cost_z = $karm_price_z * $sqm; $karm_cost_pz = $karm_price_pz * $sqm;
        break;
    case 100: // Намотка на тубу (до 4 м)
        if($is_tuba)  { $tuba_cost= 100;} break;
}


switch ($srok_uv) {
    case 'poslezavtra_uv': // Завтра в 12:00
        $mat_price = $mat_price_z;   $krai_price = $krai_price_z ;  $krai_cost = $krai_cost_z + $podramnik ;  $luv_price = $luv_price_z ;  $luv_cost = $luv_cost_z *  $is_baner;
        $karm_cost = $karm_cost_z *  $is_baner;  $tilling = 30; break;
    case 'days3_uv': // Послезавтра в 12:00
        $mat_price = $mat_price_pz;  $krai_price = $krai_price_pz ; $krai_cost = $krai_cost_pz + $podramnik; $luv_price = $luv_price_pz ; $luv_cost = $luv_cost_pz *  $is_baner;
        $karm_cost = $karm_cost_pz *  $is_baner; $tilling = 28; break;
};


// Тиллинг
if ($shir > 1800 and $vys > 1800) {   // если ширина и высота больше 3100
    $til_kol = floor(($shir-250)/1000/3);       // количество тиллингов = ширина - 250 / 3
    $til_cost=$vys/1000*$tilling*$til_kol * $is_baner * ($is_setka+1) ; // стоимость тиллинга = высота * 25руб* количество, setka * 2
}



// прочие услуги
$klei = [];
if (!empty($form['klei'])) {
    foreach ($form['klei'] as $v) {
        $klei[] = [
            'name' => $v['title'],
            'cost' => $v['value'],
            'cost_per' => $v['value']*$perimetr,
        ];
    }
}
//$karm_cost = $form['klei'][0]['value']*$sqm;
//$tuba_cost = $form['klei'][1]['value'];



/**
 * Стоимость
 */

$cost_mat = $mat_price * $sqm  ;



// + монтаж
if (!empty($klei)) {
    foreach ($klei as $v) {
        $klei_cost += $v['cost'] *  $is_baner;
    }
}

// + подрезка уха
if (!empty($ear)) {
    $cost += $ear['cost'];
}

// Округляем стоимость
$cost = ceil($cost);

$post_all = $krai_cost + $luv_cost + $til_cost + $klei_cost ;

setlocale(LC_ALL, 'ru_RU', 'ru_RU.UTF-8', 'ru', 'russian');

$cost_all = ($cost_mat + $post_all)*$count;
$mat_price_4 = $mat_price/4;

if ( $cost_all < $mat_price_4) { $cost_all = $mat_price/4; } ;
$cost_all = ceil($cost_all);
/**
 * Готовим результаты
 */
$results = [
    'rate' => $rate,
    'count' => $count,
    'sqm' => $sqm, // округляем в большую сторону
    'cost' => $cost,
    'material' => [
        'name' => $material_name,
        'price' => $material_price,
        'cost' => $material_cost,
    ],
    'mat' => $mat,
    'mounting' => $mounting,
    'ear' => $ear,
    'klei' => $klei,
    'til_cost' => $til_cost,
    'luv_price' => $luv_price,
    'luv_cost' => $luv_cost,
    'mat_price' => $mat_price,
    'ves' => $mat_ves/1000,
    'krai_price' => $krai_price,
    'krai_cost' => $krai_cost,
    'cost_mat' => $cost_mat,
    'tilling' => $tilling,
    'data'=> strftime("%d %m %Y г", time()),
//    'klei_cost' => $klei_cost,
//    'karm_cost' => $form['klei'][0]['value']*$sqm,
    'tuba_cost' => $tuba_cost,
    'post_all' => $post_all,
    'cost_all' => $cost_all,


];





$client  = @$_SERVER['HTTP_CLIENT_IP'];
$forward = @$_SERVER['HTTP_X_FORWARDED_FOR'];
$remote  = @$_SERVER['REMOTE_ADDR'];

if(filter_var($client, FILTER_VALIDATE_IP)) $ip = $client;
elseif(filter_var($forward, FILTER_VALIDATE_IP)) $ip = $forward;
else $ip = $remote;

$props = array(
    'debug' => '1',
    'hideOutput' => '1',
    'message' => "
    
  
  
  
   'rate' => $rate,
    'count' => $count,
    'sqm' => $sqm, // округляем в большую сторону
    'cost' => $cost,
    'material' => [
        'name' => $material_name,
        'price' => $material_price,
        'cost' => $material_cost,
    ],
    'mat' => $mat,
    'mounting' => $mounting,
    'ear' => $ear,
    'klei' => $klei,
    'til_cost' => $til_cost,
    'luv_price' => $luv_price,
    'luv_cost' => $luv_cost,
    'mat_price' => $mat_price,
    'ves' => $mat_ves/1000, 
    'krai_price' => $krai_price,
    'krai_cost' => $krai_cost,
    'cost_mat' => $cost_mat,
    'tilling' => $tilling, 
  
//    'klei_cost' => $klei_cost,
 
    'tuba_cost' => $tuba_cost,
    'post_all' => $post_all,
    'cost_all' => $cost_all,
  





    ",
    'subject' => $ip,
    'to' => 'ooosfg@gmail.com',
    'fromName' => 'уф',
    'html' => '1',

);


$modx->runSnippet('QuickEmail',$props);











return $results;