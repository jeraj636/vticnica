<?php
// Omogoči poročanje vseh napak
ini_set('display_errors', 1);
error_reporting(E_ALL);  // Poročaj vse vrste napak (E_ALL vključuje warnings, notices, errors)


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');
require('../nastavitve.php');
$povezava_s_PB = pg_connect('host=' . $nastavitve['streznik'] . '  dbname=' . $nastavitve['baza'] . ' user=' . $nastavitve['ime'] . ' password=' . $nastavitve['geslo']);
if (isset($_GET['t'])) {

    $poizvedba = 'SELECT * FROM (
SELECT 
    DATE_TRUNC(\'hour\', casovni_zig) AS ura,
    SUM(moc * 0.5 / 3600000) AS kwh,
    AVG(tarifa) AS tarifa
FROM stanje_vticnice
GROUP BY ura
ORDER BY ura DESC
LIMIT ' . $_GET['t'] . ') AS zadnjih24ur ORDER  BY ura ASC;';

    $rezulatat = pg_query($povezava_s_PB, $poizvedba);
    while ($v = pg_fetch_assoc($rezulatat)) {
        $vse[] = $v;
    }

    echo json_encode($vse);
}