# Declaration of the Python version.

FROM python:3.7.10

# Installing tree and openssh-client.

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y openssh-client
RUN apt-get install -y tree

# Declaration of the project file system and username inside the development container.

ARG WORKDIR=/home/python_dev/workspace
ARG WORKDIR_ROOT=/home/python_dev
ARG USERNAME=python_dev

# Creating the user on bash and their home directory.

RUN useradd --create-home --shell /bin/bash $USERNAME

# Creating the directories for the file system.

RUN mkdir -p $WORKDIR

# Adding to the container path the Python dependencies directory.

ENV PATH="/home/$USERNAME/.local/bin:$PATH"

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