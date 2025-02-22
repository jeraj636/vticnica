<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

require('nastavitve.php');
$povezava_s_PB = pg_connect('host=' . $nastavitve['streznik'] . '  dbname=' . $nastavitve['baza'] . ' user=' . $nastavitve['ime'] . ' password=' . $nastavitve['geslo']);


if (isset($_GET['id'])) {
    $poizvedba = 'SELECT * FROM stanje_vticnice WHERE id_zapisa >= $1;';
    $rezultat  = pg_query_params($povezava_s_PB, $poizvedba, [$_GET['id']]);
} else if (isset($_GET['t'])) {
    $sekunde = $_GET['t'];
    $poizvedba = 'SELECT * FROM stanje_vticnice WHERE casovni_zig >= NOW() - INTERVAL \'' . $sekunde . ' seconds\'';
    $rezultat  = pg_query($povezava_s_PB, $poizvedba);
} else {

    $poizvedba = 'SELECT * FROM stanje_vticnice;';
    $rezultat  = pg_query($povezava_s_PB, $poizvedba);
}

$vse = [];
while ($vrstica = pg_fetch_assoc($rezultat)) {
    $vse[] = $vrstica;
}
echo json_encode($vse);

pg_close();
