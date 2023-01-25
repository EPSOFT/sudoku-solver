# Declaration of the Golang version.

FROM golang:1.17rc2

# Installing tree and openssh-client.

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y openssh-client
RUN apt-get install -y tree

# Declaration of the project file system and username inside the development container.

ARG WORKDIR=/home/golang_dev/workspace
ARG WORKDIR_ROOT=/home/golang_dev
ARG USERNAME=golang_dev

# Declaration of Golang environment variables.

ENV GOROOT=/usr/local/go
ENV GOBIN=$WORKDIR/bin

# Creating the user on bash and their home directory.

RUN useradd --create-home --shell /bin/bash $USERNAME

# Creating the directories for the file system an go modules.

RUN mkdir -p $WORKDIR

# Adding to the container path the Golang dependencies directory.

ENV PATH="$GOROOT/bin:$GOBIN:$PATH"

# Changing the premises of the file system.

RUN chown -R $USERNAME $WORKDIR_ROOT $WORKDIR

RUN find "$WORKDIR_ROOT/" -type d -exec chmod 755 {} \;
RUN find "$WORKDIR_ROOT/" -type f -exec chmod 755 {} \;

RUN find "$WORKDIR/" -type d -exec chmod 755 {} \;
RUN find "$WORKDIR/" -type f -exec chmod 755 {} \;

RUN chmod 755 $WORKDIR_ROOT
RUN chmod 755 $WORKDIR

# Establishing the default user and the default work directory.

WORKDIR $WORKDIR
USER $USERNAME