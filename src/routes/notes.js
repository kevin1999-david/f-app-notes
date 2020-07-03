//Rutas
const router = require('express').Router();

const Note = require('../models/Note');

const { isAuthenticated } = require('../helpers/auth');

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});


router.post('/notes/new-note', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    const error = [];
    if (!title) {
        error.push({ text: 'Please Write a Title' });
    }

    if (!description) {
        error.push({ text: 'Please Write a Description' });
    }

    if (error.length > 0) {
        res.render('notes/new-note', {
            error,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description });

        newNote.user = req.user.id;

        await newNote.save(); //Esto va tomar un tiempo de ejecuión

        req.flash('success_msg', 'Note Added Successfully');



        res.redirect('/notes');
    }

})
//Da un error
// router.get('/notes', async (req, res) => {
//     const notes = await Note.find();
//     res.render('notes/all-notes', { notes });
// });

router.get('/notes', isAuthenticated, async (req, res) => {

    await Note.find({ user: req.user.id }).sort({ date: 'desc' })

        .then(documentos => {
            const contexto = {

                notes: documentos.map(documento => {

                    return {
                        id: documento._id,
                        title: documento.title,
                        description: documento.description,
                        date: documento.date
                    }
                })
            }

            res.render('notes/all-notes', {
                notes: contexto.notes
            })
        });
});


router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id);
    console.log(note);
    res.render('notes/edit-note', {
        id: note._id,
        title: note.title,
        description: note.description,
        date: note.date
    });
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body;
    // console.log('BODY');
    // console.log(req.body);
    await Note.findByIdAndUpdate(req.params.id, { title, description });
    req.flash('success_msg', 'Note Updated Successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);

    req.flash('success_msg', 'Note Deleted Successfully');
    res.redirect('/notes');


});

module.exports = router;
