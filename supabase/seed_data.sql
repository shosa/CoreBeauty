-- CoreBeauty - Dati di Esempio per Testing
-- IMPORTANTE: Esegui DOPO aver creato il primo utente tramite l'app
-- Sostituisci 'YOUR_USER_ID' con il tuo UUID utente (dalla tabella users)

-- =====================================================
-- ISTRUZIONI:
-- 1. Crea il primo utente dall'app (PIN setup)
-- 2. Vai su Supabase > Table Editor > users
-- 3. Copia il tuo UUID (es: 123e4567-e89b-12d3-a456-426614174000)
-- 4. Sostituisci 'YOUR_USER_ID' qui sotto con il tuo UUID
-- 5. Esegui questo script in SQL Editor
-- =====================================================

-- INSERISCI IL TUO USER_ID QUI
DO $$
DECLARE
    v_user_id UUID := 'YOUR_USER_ID'; -- <-- CAMBIA QUESTO!
BEGIN
    -- Verifica che l'utente esista
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_user_id) THEN
        RAISE EXCEPTION 'Utente non trovato! Assicurati di aver sostituito YOUR_USER_ID con il tuo UUID dalla tabella users';
    END IF;

    -- ================== CLIENTI ==================
    INSERT INTO clienti (nome_cliente, numero_telefono, email, user_id) VALUES
    ('Maria Rossi', '+39 348 123 4567', 'maria.rossi@email.com', v_user_id),
    ('Giulia Bianchi', '+39 333 987 6543', 'giulia.bianchi@email.com', v_user_id),
    ('Laura Verdi', '+39 347 555 1234', NULL, v_user_id),
    ('Sara Neri', '+39 320 111 2222', 'sara.neri@email.com', v_user_id),
    ('Francesca Romano', '+39 339 444 5555', NULL, v_user_id),
    ('Chiara Ferrari', '+39 340 777 8888', 'chiara.ferrari@email.com', v_user_id),
    ('Alessia Ricci', '+39 349 999 0000', NULL, v_user_id),
    ('Martina Costa', '+39 335 222 3333', 'martina.costa@email.com', v_user_id),
    ('Elena Marino', '+39 338 666 7777', NULL, v_user_id),
    ('Sofia Greco', '+39 346 888 9999', 'sofia.greco@email.com', v_user_id);

    -- ================== SERVIZI ==================

    -- VISO
    INSERT INTO servizi (nome_servizio, tempo_medio, costo, categoria, user_id) VALUES
    ('Pulizia Viso Completa', 60, 45.00, 'VISO', v_user_id),
    ('Trattamento Anti-età', 75, 65.00, 'VISO', v_user_id),
    ('Maschera Idratante', 45, 35.00, 'VISO', v_user_id),
    ('Peeling Chimico', 90, 80.00, 'VISO', v_user_id),
    ('Massaggio Viso', 30, 30.00, 'VISO', v_user_id);

    -- MANI
    INSERT INTO servizi (nome_servizio, tempo_medio, costo, categoria, user_id) VALUES
    ('Manicure Base', 30, 20.00, 'MANI', v_user_id),
    ('Manicure con Gel', 45, 30.00, 'MANI', v_user_id),
    ('Ricostruzione Unghie', 90, 45.00, 'MANI', v_user_id),
    ('Nail Art', 60, 35.00, 'MANI', v_user_id),
    ('Trattamento Cuticole', 20, 15.00, 'MANI', v_user_id);

    -- PIEDI
    INSERT INTO servizi (nome_servizio, tempo_medio, costo, categoria, user_id) VALUES
    ('Pedicure Base', 45, 25.00, 'PIEDI', v_user_id),
    ('Pedicure con Gel', 60, 35.00, 'PIEDI', v_user_id),
    ('Trattamento Calli', 30, 20.00, 'PIEDI', v_user_id),
    ('Massaggio Piedi', 30, 25.00, 'PIEDI', v_user_id),
    ('Spa Piedi Completa', 90, 50.00, 'PIEDI', v_user_id);

    -- CORPO
    INSERT INTO servizi (nome_servizio, tempo_medio, costo, categoria, user_id) VALUES
    ('Massaggio Rilassante', 60, 50.00, 'CORPO', v_user_id),
    ('Massaggio Drenante', 75, 60.00, 'CORPO', v_user_id),
    ('Scrub Corpo', 45, 40.00, 'CORPO', v_user_id),
    ('Trattamento Anti-Cellulite', 60, 55.00, 'CORPO', v_user_id),
    ('Bendaggi', 90, 70.00, 'CORPO', v_user_id);

    -- CERETTA
    INSERT INTO servizi (nome_servizio, tempo_medio, costo, categoria, user_id) VALUES
    ('Ceretta Gambe Complete', 45, 30.00, 'CERETTA', v_user_id),
    ('Ceretta Braccia', 30, 20.00, 'CERETTA', v_user_id),
    ('Ceretta Inguine', 30, 25.00, 'CERETTA', v_user_id),
    ('Ceretta Ascelle', 15, 12.00, 'CERETTA', v_user_id),
    ('Ceretta Viso', 20, 15.00, 'CERETTA', v_user_id);

    -- ================== APPUNTAMENTI ==================
    -- Appuntamenti per oggi e prossimi giorni

    -- Oggi
    INSERT INTO appuntamenti (id_cliente, id_servizio, data_appuntamento, tempo_servizio, note, completato, user_id)
    SELECT
        (SELECT id_cliente FROM clienti WHERE nome_cliente = 'Maria Rossi' AND user_id = v_user_id),
        (SELECT id_servizio FROM servizi WHERE nome_servizio = 'Manicure con Gel' AND user_id = v_user_id),
        CURRENT_DATE + TIME '09:00:00',
        45,
        'Prima volta, molto puntuale',
        FALSE,
        v_user_id;

    INSERT INTO appuntamenti (id_cliente, id_servizio, data_appuntamento, tempo_servizio, note, completato, user_id)
    SELECT
        (SELECT id_cliente FROM clienti WHERE nome_cliente = 'Giulia Bianchi' AND user_id = v_user_id),
        (SELECT id_servizio FROM servizi WHERE nome_servizio = 'Pulizia Viso Completa' AND user_id = v_user_id),
        CURRENT_DATE + TIME '11:00:00',
        60,
        NULL,
        FALSE,
        v_user_id;

    INSERT INTO appuntamenti (id_cliente, id_servizio, data_appuntamento, tempo_servizio, note, completato, user_id)
    SELECT
        (SELECT id_cliente FROM clienti WHERE nome_cliente = 'Laura Verdi' AND user_id = v_user_id),
        (SELECT id_servizio FROM servizi WHERE nome_servizio = 'Pedicure con Gel' AND user_id = v_user_id),
        CURRENT_DATE + TIME '14:30:00',
        60,
        'Allergia nickel',
        FALSE,
        v_user_id;

    -- Domani
    INSERT INTO appuntamenti (id_cliente, id_servizio, data_appuntamento, tempo_servizio, note, completato, user_id)
    SELECT
        (SELECT id_cliente FROM clienti WHERE nome_cliente = 'Sara Neri' AND user_id = v_user_id),
        (SELECT id_servizio FROM servizi WHERE nome_servizio = 'Massaggio Rilassante' AND user_id = v_user_id),
        CURRENT_DATE + INTERVAL '1 day' + TIME '10:00:00',
        60,
        NULL,
        FALSE,
        v_user_id;

    INSERT INTO appuntamenti (id_cliente, id_servizio, data_appuntamento, tempo_servizio, note, completato, user_id)
    SELECT
        (SELECT id_cliente FROM clienti WHERE nome_cliente = 'Francesca Romano' AND user_id = v_user_id),
        (SELECT id_servizio FROM servizi WHERE nome_servizio = 'Ceretta Gambe Complete' AND user_id = v_user_id),
        CURRENT_DATE + INTERVAL '1 day' + TIME '15:00:00',
        45,
        NULL,
        FALSE,
        v_user_id;

    -- Dopodomani
    INSERT INTO appuntamenti (id_cliente, id_servizio, data_appuntamento, tempo_servizio, note, completato, user_id)
    SELECT
        (SELECT id_cliente FROM clienti WHERE nome_cliente = 'Chiara Ferrari' AND user_id = v_user_id),
        (SELECT id_servizio FROM servizi WHERE nome_servizio = 'Trattamento Anti-età' AND user_id = v_user_id),
        CURRENT_DATE + INTERVAL '2 days' + TIME '09:30:00',
        75,
        'Cliente VIP',
        FALSE,
        v_user_id;

    -- Alcuni appuntamenti passati completati
    INSERT INTO appuntamenti (id_cliente, id_servizio, data_appuntamento, tempo_servizio, note, completato, user_id)
    SELECT
        (SELECT id_cliente FROM clienti WHERE nome_cliente = 'Alessia Ricci' AND user_id = v_user_id),
        (SELECT id_servizio FROM servizi WHERE nome_servizio = 'Manicure Base' AND user_id = v_user_id),
        CURRENT_DATE - INTERVAL '1 day' + TIME '10:00:00',
        30,
        NULL,
        TRUE,
        v_user_id;

    INSERT INTO appuntamenti (id_cliente, id_servizio, data_appuntamento, tempo_servizio, note, completato, user_id)
    SELECT
        (SELECT id_cliente FROM clienti WHERE nome_cliente = 'Martina Costa' AND user_id = v_user_id),
        (SELECT id_servizio FROM servizi WHERE nome_servizio = 'Pulizia Viso Completa' AND user_id = v_user_id),
        CURRENT_DATE - INTERVAL '2 days' + TIME '14:00:00',
        60,
        NULL,
        TRUE,
        v_user_id;

    -- ================== NOTE ==================
    INSERT INTO annotazioni (data, note, user_id) VALUES
    (CURRENT_DATE, 'Ordinare nuovi prodotti per manicure', v_user_id),
    (CURRENT_DATE + INTERVAL '3 days', 'Chiamare fornitore per nuovi smalti', v_user_id),
    (CURRENT_DATE + INTERVAL '7 days', 'Revisione attrezzature', v_user_id),
    (CURRENT_DATE + INTERVAL '14 days', 'Formazione nuovo trattamento viso', v_user_id);

    RAISE NOTICE '✅ Dati di esempio inseriti con successo!';
    RAISE NOTICE 'Inseriti:';
    RAISE NOTICE '- 10 clienti';
    RAISE NOTICE '- 25 servizi (5 per ogni categoria)';
    RAISE NOTICE '- 8 appuntamenti (3 oggi, 2 domani, 1 dopodomani, 2 passati)';
    RAISE NOTICE '- 4 note';
END $$;
