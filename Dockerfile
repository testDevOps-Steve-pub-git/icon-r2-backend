FROM strongloop/node

# you should npm install first, before doing this
# otherwise you will need to use root which is not
# secure as it will give full access to the host

EXPOSE 3000

# copy app
ADD . /home/strongloop/app
WORKDIR /home/strongloop/app

# ENV NODE_ENV production
CMD [ "slc", "run", "." ]
