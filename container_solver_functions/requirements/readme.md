# About this sub folder

This sub folder contains the dependencies files of the respective micro service stored in the father folder of this one, the dependencies files stored in this folder are divided in two groups, the development.txt (first group) file contains all the dependencies that are needed just for the development, like code formatters or pip dependencies checkers, in the other hand common.txt (second group) contains all the dependencies that are mandatory needed for the correct working of the micro service, this division were made in this way because in this way when the Docker image for deployment is build the development dependencies are not going to be needed, so in the image building process just the common dependencies are going to be installed saving some memory and making the image lighter and more portable.\
There is a third file that is used, all.txt, but this file is ignored by the repository system because it use is just while the dependencies of this file are transferred from it to the other two dependencies files, it's used because the Python dependencies installer (pip) don't separate the dependencies automatically, so it's needed to export all the dependencies to one common file (all.txt) and after that make the separation manually.\
The dependencies are exported using the package pipdeptree, that gives us just the first level dependencies using the next command.

```bash
pipdeptree --warn silence | grep -E '^\w+' > requirements/all.txt
```

<br>
