import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Alerta from './Alerta'
import Spinner from './Spinner'

const Formulario = ({ cliente, cargando }) => {
  const navigate = useNavigate()

  const nuevoClienteSchema = Yup.object().shape({
    nombre: Yup.string()
      .min(3, 'El nombre es muy corto')
      .max(20, 'El nombre es muy largo')
      .required('El Nombre del Cliente es Obligatorio'),
    empresa: Yup.string().required('El Nombre de la empresa es Obligatorio'),
    email: Yup.string()
      .email('Email no válido')
      .required('El email es Obligatorio'),
    telefono: Yup.number()
      .positive('El número no es válido')
      .integer('El número no es válido')
      .typeError('El número no es válido'),
    notas: '',
  })

  const handleSubmit = async (valores) => {
    try {
      let respuesta
      if (cliente.id) {
        //Editando un Registro
        const url = `http://localhost:4000/clientes/${cliente.id}`

        respuesta = await fetch(url, {
          method: 'PUT',
          body: JSON.stringify(valores),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } else {
        //Nuevo Registro
        const url = 'http://localhost:4000/clientes'

        respuesta = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(valores),
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
      await respuesta.json()
      navigate('/clientes')
    } catch (error) {
      console.log(error)
    }
  }

  return cargando ? (
    <Spinner />
  ) : (
    <div className='bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto'>
      <h1 className='text-gray-600 font-bold text-xl uppercase text-center'>
        {cliente.nombre ? 'Editar Cliente' : 'Agregar Cliente'}
      </h1>

      <Formik
        initialValues={{
          nombre: cliente?.nombre ?? '',
          empresa: cliente?.empresa ?? '',
          email: cliente?.email ?? '',
          telefono: cliente?.telefono ?? '',
          notas: cliente?.notas ?? '',
        }}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          await handleSubmit(values)
          resetForm()
        }}
        validationSchema={nuevoClienteSchema}
      >
        {({ errors, touched }) => {
          console.log(touched)
          return (
            <Form className='mt-10'>
              <div className='mb-4'>
                <label htmlFor='nombre' className='text-gray-800'>
                  Nombre:{' '}
                </label>
                <Field
                  id='nombre'
                  className='mt-2 block w-full p-3 bg-gray-50 rounded-sm'
                  type='text'
                  placeholder='Nombre del Cliente'
                  name='nombre'
                />
                {errors.nombre && touched.nombre ? (
                  <Alerta>{errors.nombre}</Alerta>
                ) : null}
              </div>
              <div className='mb-4'>
                <label htmlFor='empresa' className='text-gray-800'>
                  Empresa:{' '}
                </label>
                <Field
                  id='empresa'
                  className='mt-2 block w-full p-3 bg-gray-50 rounded-sm'
                  type='text'
                  placeholder='Empresa del Cliente'
                  name='empresa'
                />
                {errors.empresa && touched.empresa ? (
                  <Alerta>{errors.empresa}</Alerta>
                ) : null}
              </div>
              <div className='mb-4'>
                <label htmlFor='email' className='text-gray-800'>
                  E-mail:{' '}
                </label>
                <Field
                  id='email'
                  className='mt-2 block w-full p-3 bg-gray-50 rounded-sm'
                  type='email'
                  placeholder='Email del Cliente'
                  name='email'
                />
                {errors.email && touched.email ? (
                  <Alerta>{errors.email}</Alerta>
                ) : null}
              </div>
              <div className='mb-4'>
                <label htmlFor='telefono' className='text-gray-800'>
                  Teléfono:{' '}
                </label>
                <Field
                  id='telefono'
                  className='mt-2 block w-full p-3 bg-gray-50 rounded-sm'
                  type='tel'
                  placeholder='Teléfono del Cliente'
                  name='telefono'
                />
                {errors.telefono && touched.telefono ? (
                  <Alerta>{errors.telefono}</Alerta>
                ) : null}
              </div>
              <div className='mb-4'>
                <label htmlFor='notas' className='text-gray-800'>
                  Notas:{' '}
                </label>
                <Field
                  as='textarea'
                  id='notas'
                  className='mt-2 block w-full p-3 bg-gray-50  h-40 rounded-sm'
                  type='text'
                  placeholder='Notas del Cliente'
                  name='notas'
                />
              </div>

              <input
                value={cliente.nombre ? 'Editar Cliente' : 'Agregar Cliente'}
                type='submit'
                className='mt-5 w-full bg-blue-800 p-3 text-white uppercase font-bold text-center text-lg rounded-md cursor-pointer'
              />
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}

Formulario.defaultProps = {
  cliente: {},
  cargando: false,
}

export default Formulario
