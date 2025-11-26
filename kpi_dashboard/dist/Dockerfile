FROM nginx:alpine

# Copy built files
COPY index.html /usr/share/nginx/html/
COPY vite.svg /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

# Copy assets to the path the app expects
COPY assets /usr/share/nginx/html/src/Components/assets

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
