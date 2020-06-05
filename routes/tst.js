// if there was a request to add/remove a user to the class,
if (req.body.enrolled) {
  // check if user is already enrolled
  if (classToEdit.enrolled.some((id) => id === req.body.id)) {
    // remove user from class
    classToEdit.enrolled = classToEdit.enrolled.filter(
      (id) => id !== req.body.id
    );

    // remove the class from the user's enrolled list
    user.enrolled = user.enrolled.filter((id) => id !== req.params.id);

    // increment the number of give ups to that class
    classToEdit.giveups++;
  } else {
    // test if the class is full
    if (classToEdit.enrolled.length === classToEdit.max) {
      // Put back the enrolled list to the class
      await classToEdit.update({ $set: { enrolled } });
      // Reject if class is full
      res.status(403).json({ msg: 'Class is full' });
    } else {
      // Add user to class
      enrolled.unshift(req.body.enrolled);

      // update the enrolled list
      await classToEdit.update({ $set: { enrolled } });

      // add class to user's enrolled list
      user.enrolled.unshift(req.params.id);
    }
  }
}
