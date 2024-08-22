FROM gitpod/workspace-full

# Install Node.js 18.x
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && \
    sudo apt-get install -y nodejs
