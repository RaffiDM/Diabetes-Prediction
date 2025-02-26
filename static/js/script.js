// Initialize form validation
(function() {
    'use strict';
    
    // Fetch all forms we want to apply validation to
    const forms = document.querySelectorAll('.needs-validation');
    
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms).forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
})();

// Initialize chart
let myChart = null;

function initializeGaugeChart(probabilityValue) {
    const chartDom = document.getElementById('gauge-chart');
    myChart = echarts.init(chartDom);
    
    const option = {
        series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 1,
            splitNumber: 4,
            itemStyle: {
                color: function(params) {
                    // Gradient color based on probability value
                    const value = params.value;
                    if (value < 0.25) {
                        return '#34C759'; // Green for low probability
                    } else if (value < 0.5) {
                        return '#FFD60A'; // Yellow for moderate probability
                    } else if (value < 0.75) {
                        return '#FF9500'; // Orange for high probability
                    } else {
                        return '#FF3B30'; // Red for very high probability
                    }
                }
            },
            progress: {
                show: true,
                width: 20
            },
            pointer: {
                show: true,
                length: '60%',
                width: 6
            },
            axisLine: {
                lineStyle: {
                    width: 20
                }
            },
            axisTick: {
                distance: -25,
                splitNumber: 5,
                lineStyle: {
                    color: '#999',
                    width: 1
                }
            },
            splitLine: {
                distance: -30,
                length: 12,
                lineStyle: {
                    color: '#999',
                    width: 2
                }
            },
            axisLabel: {
                distance: -15,
                fontSize: 12,
                formatter: function(value) {
                    return (value * 100) + '%';
                }
            },
            anchor: {
                show: true,
                showAbove: true,
                size: 16,
                itemStyle: {
                    borderWidth: 2
                }
            },
            detail: {
                valueAnimation: true,
                fontSize: 30,
                fontWeight: 'bold',
                formatter: function(value) {
                    return (value * 100).toFixed(1) + '%';
                },
                offsetCenter: [0, '30%']
            },
            data: [{
                value: probabilityValue
            }]
        }]
    };
    
    myChart.setOption(option);
}

// Form submission handling
$(document).ready(function() {
    // Form submit event
    $('#prediction-form').submit(function(e) {
        e.preventDefault();
        
        // Check form validity
        if (!this.checkValidity()) {
            return false;
        }
        
        // Collect form data
        const formData = new FormData(this);
        
        // Show result card and animation
        $('#result-card').show();
        $('#result-content').hide();
        $('#result-animation').show();
        
        // Scroll to result card
        $('html, body').animate({
            scrollTop: $('#result-card').offset().top - 100
        }, 500);
        
        // Send AJAX request
        $.ajax({
            url: '/predict',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                // Hide loading animation
                $('#result-animation').hide();
                
                // Show prediction result after a short delay
                setTimeout(function() {
                    // Update result content
                    const probability = response.probability;
                    
                    // Initialize gauge chart
                    initializeGaugeChart(probability);
                    
                    // Set result message
                    $('#result-message').text(response.message);
                    $('#result-probability').text(`Probabilitas risiko diabetes: ${(probability * 100).toFixed(1)}%`);
                    
                    // Set alert based on prediction
                    if (response.prediction === 1) {
                        $('#result-alert').removeClass('alert-success').addClass('alert-danger');
                        $('#result-alert').html(`
                            <i class="fas fa-exclamation-circle me-2"></i>
                            <strong>Risiko Tinggi:</strong> Hasil prediksi menunjukkan risiko diabetes yang tinggi.
                            Sebaiknya konsultasikan dengan dokter untuk pemeriksaan lebih lanjut.
                        `);
                    } else {
                        $('#result-alert').removeClass('alert-danger').addClass('alert-success');
                        $('#result-alert').html(`
                            <i class="fas fa-check-circle me-2"></i>
                            <strong>Risiko Rendah:</strong> Hasil prediksi menunjukkan risiko diabetes yang rendah.
                            Tetap jaga pola hidup sehat untuk mencegah diabetes.
                        `);
                    }
                    
                    // Show result content with animation
                    $('#result-content').show().addClass('fade-in');
                    
                    // Resize chart to fit container
                    window.addEventListener('resize', function() {
                        if (myChart) {
                            myChart.resize();
                        }
                    });
                }, 800);
            },
            error: function(error) {
                $('#result-animation').hide();
                $('#result-content').show();
                $('#result-message').text('Terjadi Kesalahan');
                $('#result-alert').removeClass('alert-success').addClass('alert-danger');
                $('#result-alert').html(`
                    <i class="fas fa-times-circle me-2"></i>
                    <strong>Error:</strong> ${error.responseJSON ? error.responseJSON.error : 'Gagal melakukan prediksi. Silakan coba lagi.'}
                `);
            }
        });
    });
    
    // Reset button
    $('#reset-btn').click(function() {
        // Reset form
        $('#prediction-form')[0].reset();
        $('#prediction-form').removeClass('was-validated');
        
        // Hide result card
        $('#result-card').hide();
        
        // Scroll to form
        $('html, body').animate({
            scrollTop: $('#prediction-form').offset().top - 100
        }, 500);
    });
    
    // Set input range values when typing in number inputs
    $('input[type="number"]').on('input', function() {
        const min = parseFloat($(this).attr('min')) || 0;
        const max = parseFloat($(this).attr('max')) || 100;
        let val = parseFloat($(this).val()) || 0;
        
        // Clamp value between min and max
        val = Math.max(min, Math.min(max, val));
        $(this).val(val);
    });
});

// Window resize event to handle chart responsive behavior
window.addEventListener('resize', function() {
    if (myChart) {
        myChart.resize();
    }
});