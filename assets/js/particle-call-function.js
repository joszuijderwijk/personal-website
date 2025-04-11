
document.addEventListener("DOMContentLoaded", function () {
    // Function to determine the user's system theme preference
    const getSystemTheme = () => {
        const theme = document.documentElement.getAttribute("data-theme");
        return theme === "dark" ? "dark" : "light";
    };
  
    // Load and modify particles configuration based on the system theme
    particlesJS.load('particles-js', '/assets/json/particles.json', function() {
        console.log('callback - particles.js config loaded');
        
        // Modify particle colors based on the theme
        const theme = getSystemTheme();
        const particles = pJSDom[0].pJS.particles;
  
        if (theme === "dark") {
            particles.color.value = '#ffffff';
            particles.line_linked.color = '#ffffff';
        } else {
            particles.color.value = '#b71c1c';
            particles.line_linked.color = '#b71c1c';
        }
  
        // Refresh particles.js settings
        pJSDom[0].pJS.fn.particlesRefresh();
    });
  });