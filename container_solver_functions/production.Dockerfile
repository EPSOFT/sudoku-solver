# Declaration of the Python version.

FROM python:3.7.10-alpine

# Declaration of the project file system and username inside the development container.

ARG USERNAME=production
ARG WORKDIR=/home/$USERNAME

# Creating the user on ash and their home directory.

RUN adduser --home $WORKDIR --shell /bin/ash $USERNAME --disabled-password

# Copying the requirements files to the container.

COPY ["requirements/commons.txt","$WORKDIR"]

# Adding to the container path the Python dependencies directory.

ENV PATH="/home/$USERNAME/.local/bin:$PATH"

# Changing the premises of the file system.

RUN chown -R $USERNAME $WORKDIR

RUN find "$WORKDIR/" -type d -exec chmod 755 {} \;
RUN find "$WORKDIR/" -type f -exec chmod 755 {} \;

RUN chmod 755 $WORKDIR

# Installing default missing dependencies

RUN apk update && apk upgrade
RUN apk add --no-cache libc-dev
RUN apk add --no-cache gcc

# Establishing the default user and the default work directory.

WORKDIR $WORKDIR
USER $USERNAME

# Installing the dependencies and upgrading pip.

RUN pip install --upgrade pip
RUN pip install -r commons.txt

# Copying the source code of the api.

COPY [".","$WORKDIR"]