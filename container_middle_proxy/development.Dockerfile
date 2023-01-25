# Declaration of the Node version.

FROM node:16.6.1

# Installing tree and openssh-client.

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y openssh-client
RUN apt-get install -y tree

# Declaration of the node npm directories that need to be available to be edited.

ARG NPM_PATH_1=/usr/local/lib/node_modules
ARG NPM_PATH_2=/usr/local/bin

# Declaration of the project file system and username inside the development container.

ARG WORKDIR=/home/node_dev/workspace
ARG WORKDIR_ROOT=/home/node_dev
ARG USERNAME=node_dev

# Removing default node user.

RUN rm -r /home/node
RUN userdel node

# Creating the user on bash and their home directory.

RUN useradd --create-home --shell /bin/bash $USERNAME

# Creating the directories for the file system an node modules.

RUN mkdir -p $WORKDIR

# Adding to the container path the Node dependencies directory.

ENV PATH="/usr/local/nodejs/bin:$PATH"

# Changing the premises of the file system.

RUN chown -R $USERNAME $WORKDIR_ROOT $WORKDIR $NPM_PATH_1 $NPM_PATH_2

RUN find "$WORKDIR_ROOT/" -type d -exec chmod 755 {} \;
RUN find "$WORKDIR_ROOT/" -type f -exec chmod 755 {} \;

RUN find "$WORKDIR/" -type d -exec chmod 755 {} \;
RUN find "$WORKDIR/" -type f -exec chmod 755 {} \;

RUN chmod 755 $WORKDIR_ROOT
RUN chmod 755 $WORKDIR

# Establishing the default user and the default work directory.

WORKDIR $WORKDIR
USER $USERNAME