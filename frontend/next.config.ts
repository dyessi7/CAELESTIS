import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite abrir el servidor de desarrollo desde otros dispositivos de la
  // red (p. ej. el celular). Sin esto, Next bloquea sus recursos de dev y la
  // página carga sin JavaScript: se ve, pero nada reacciona.
  allowedDevOrigins: ["172.21.240.1", "192.168.*.*"],
};

export default nextConfig;
