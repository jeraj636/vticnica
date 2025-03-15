const platno_za_graf_moci = document.getElementById('moc').getContext('2d');
function jeAndroid() {
    return /Android/i.test(navigator.userAgent);
}
let odzadje = 'rgba(75, 192, 192, 0.2)';
let x_crte = 'rgba(200, 200, 200, 0.1)';
let y_crte = 'rgba(200, 200, 200, 0.8)';
let graf1_barva = 'rgb(192, 249, 255)';
let graf2_barva = 'rgb(255, 255, 192)';
let graf3_barva = 'rgb(255, 218, 192)';
let debelina = 2;
let tocka = 1;

if (jeAndroid()) {
    debelina = 1;
    tocka = 0.5;
}
let vel_pisave = 16;
let font = 'Poppins';
let barva_pisave = 'whitesmoke';
const graf_moci = new Chart(platno_za_graf_moci, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Moč [W]',
            data: [],
            borderColor: graf1_barva,
            backgroundColor: odzadje,
            borderWidth: debelina,
            pointRadius: tocka,
            fill: false,
        }]
    },
    options: {
        responsive: false,
        animation: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: vel_pisave,
                        family: font
                    },
                    color: barva_pisave
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true, color: x_crte
                }
            },
            y: {
                beginAtZero: true,
                grid: { display: true, color: y_crte }
            }
        }
    }
});

const platno_za_graf_toka = document.getElementById('tok').getContext('2d');
const graf_toka = new Chart(platno_za_graf_toka, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Tok [I]',
            data: [],
            borderColor: graf2_barva,
            backgroundColor: odzadje,
            borderWidth: debelina,
            pointRadius: tocka,
            fill: false,
        }]
    },
    options: {
        responsive: false,
        animation: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: vel_pisave,
                        family: font
                    },
                    color: barva_pisave
                }
            }
        },
        scales: {
            x: {
                grid: { display: true, color: x_crte }
            },
            y: {
                beginAtZero: true,
                grid: { display: true, color: y_crte }
            }
        }
    }
});

const platno_za_graf_napetosti = document.getElementById('napetost').getContext('2d');
const graf_napetosti = new Chart(platno_za_graf_napetosti, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Napetost',
            data: [],
            borderColor: graf3_barva,
            backgroundColor: odzadje,
            borderWidth: debelina,
            pointRadius: tocka,
            fill: false,
        }]
    },
    options: {
        responsive: false,
        animation: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: vel_pisave,
                        family: font
                    },
                    color: barva_pisave
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true, color: x_crte
                }
            },
            y: {
                beginAtZero: true,
                grid: { display: true, color: y_crte }
            }
        }
    }
});



const platno_za_graf_cen = document.getElementById('cena').getContext('2d');
const graf_cen = new Chart(platno_za_graf_cen, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'cena',
            data: [],
            borderColor: graf2_barva,
            backgroundColor: odzadje,
            borderWidth: debelina,
            pointRadius: tocka,
            fill: false,
        }]
    },
    options: {
        responsive: false,
        animation: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: vel_pisave,
                        family: font
                    },
                    color: barva_pisave
                }
            }
        },
        scales: {
            x: {
                grid: { display: true, color: x_crte }
            },
            y: {
                beginAtZero: true,
                grid: { display: true, color: y_crte }
            }
        }
    }
});

const platno_za_graf_kwh = document.getElementById('kwh').getContext('2d');
const graf_kwh = new Chart(platno_za_graf_kwh, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'KWh',
            data: [],
            borderColor: graf3_barva,
            backgroundColor: odzadje,
            borderWidth: debelina,
            pointRadius: tocka,
            fill: false,
        }]
    },
    options: {
        responsive: false,
        animation: false,
        plugins: {
            legend: {
                labels: {
                    font: {
                        size: vel_pisave,
                        family: font
                    },
                    color: barva_pisave
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: true, color: x_crte
                }
            },
            y: {
                beginAtZero: true,
                grid: { display: true, color: y_crte }
            }
        }
    }
});
