# Declaration of the Node version.

FROM node:16.6.1-alpine

# Declaration of the node npm directories that need to be available to be edited.

ARG NPM_PATH_1=/usr/local/lib/node_modules
ARG NPM_PATH_2=/usr/local/bin

# Declaration of the project file system and username inside the development container.

ARG USERNAME=production
ARG WORKDIR=/home/$USERNAME

# Removing default node user.

RUN rm -r /home/node
RUN deluser node

# Creating the user on ash and their home directory.

RUN adduser --home $WORKDIR --shell /bin/ash $USERNAME --disabled-password

# Copying the requirements files to the container.

COPY ["package.json", "$WORKDIR/"]

# Adding to the container path the Node dependencies directory.

ENV PATH="/home/$USERNAME/.local/bin:$PATH"

# Changing the premises of the file system.

RUN chown -R $USERNAME $WORKDIR_ROOT $WORKDIR $NPM_PATH_1 $NPM_PATH_2

RUN find "$WORKDIR/" -type d -exec chmod 755 {} \;
RUN find "$WORKDIR/" -type f -exec chmod 755 {} \;

RUN chmod 755 $WORKDIR

# Establishing the default user and the default work directory.

WORKDIR $WORKDIR
USER $USERNAME

# Installing the dependencies and upgrading npm.

RUN npm install -g npm@latest
RUN npm install --production=true

# Copying the source code of the api.

COPY [".", "$WORKDIR/"]